import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';
import ImagePreviewModal from './ImagePreviewModal';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, listenForMessages, unListenForMessages, isTyping } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    listenForMessages();

    return () => unListenForMessages();
  }, [getMessages, selectedUser._id, listenForMessages, unListenForMessages])

  useEffect(() => {
    if (messagesEndRef.current && (messages || isTyping)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping])

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <EmptyChat type="single" />
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img src={message.senderId === authUser._id ? authUser.profilePicture || '/avatar.png' : selectedUser.profilePicture || '/avatar.png'} alt='Profile Picture' />
                </div>
              </div>
              <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>{new Date(message.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</time>
              </div>
              <div className={`chat-bubble rounded-md flex flex-col ${message.senderId === authUser._id ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>
                {
                  message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className='sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity'
                      onClick={() => setSelectedImage(message.image)}
                    />
                  )
                }
                {message.content && <p className=''>{message.content}</p>}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="chat chat-start">
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={selectedUser.profilePicture || '/avatar.png'} alt='Profile Picture' />
              </div>
            </div>
            <div className='chat-bubble bg-base-200'>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </div>
  )
}

export default ChatContainer