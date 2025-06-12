import React, { useEffect, useRef, useState } from 'react'
import { useGroupChatStore } from '../store/useGroupChatStore';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';
import ImagePreviewModal from './ImagePreviewModal';

const GroupChatContainer = () => {
  const {
    groupMessages,
    getGroupMessages,
    isMessagesLoading,
    selectedGroup,
    listenForGroupMessages,
    unListenForGroupMessages,
    isTyping
  } = useGroupChatStore();
  const { authUser, socket } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedGroup) {
      socket.emit('join-group', selectedGroup._id);
      getGroupMessages(selectedGroup._id);
      listenForGroupMessages();
    }

    return () => {
      if (selectedGroup) {
        socket.emit('leave-group', selectedGroup._id);
      }
      unListenForGroupMessages();
    }
  }, [getGroupMessages, selectedGroup?._id, listenForGroupMessages, unListenForGroupMessages, socket]);

  useEffect(() => {
    if (messagesEndRef.current && (groupMessages || isTyping)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages, isTyping]);

  // Listen for typing events
  useEffect(() => {
    if (!selectedGroup) return;

    const handleGroupTyping = ({ groupId, userId }) => {
      if (groupId === selectedGroup._id) {
        // Find the typing user in group members
        const typingMember = selectedGroup.members.find(member => member._id === userId);
        if (typingMember) {
          setTypingUser(typingMember);
        }
      }
    };

    const handleGroupStopTyping = ({ groupId }) => {
      if (groupId === selectedGroup._id) {
        setTypingUser(null);
      }
    };

    socket.on('group-typing', handleGroupTyping);
    socket.on('group-stop-typing', handleGroupStopTyping);

    return () => {
      socket.off('group-typing', handleGroupTyping);
      socket.off('group-stop-typing', handleGroupStopTyping);
    };
  }, [selectedGroup, socket]);

  if (!selectedGroup) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center'>
        <p className='text-lg text-gray-500'>Select a group to start chatting</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader
          name={selectedGroup.name}
          image={selectedGroup.groupPicture}
          isGroup={true}
          members={selectedGroup.members}
        />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader
        name={selectedGroup.name}
        image={selectedGroup.groupPicture}
        isGroup={true}
        members={selectedGroup.members}
      />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {groupMessages.length === 0 ? (
          <EmptyChat type="group" />
        ) : (
          groupMessages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId._id === authUser._id ? 'chat-end' : 'chat-start'}`}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img
                    src={message.senderId === authUser._id
                      ? authUser.profilePicture || '/avatar.png'
                      : message.senderId?.profilePicture || '/avatar.png'
                    }
                    alt='Profile Picture'
                  />
                </div>
              </div>
              <div className='chat-header mb-1'>
                {message.senderId !== authUser._id && (
                  <span className='text-sm font-semibold'>
                    {message.senderId?.fullName || 'Unknown User'}
                  </span>
                )}
                <time className='text-xs opacity-50 ml-1'>
                  {new Date(message.createdAt).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </time>
              </div>
              <div className={`chat-bubble rounded-md flex flex-col ${message.senderId === authUser._id
                ? 'bg-primary text-primary-content'
                : 'bg-base-200'
                }`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className='sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity'
                    onClick={() => setSelectedImage(message.image)}
                  />
                )}
                {message.content && <p className=''>{message.content}</p>}
              </div>
              {message.readBy && message.readBy.length > 0 && (
                <div className='chat-footer opacity-50 text-xs mt-1'>
                  Read by {message.readBy.length} members
                </div>
              )}
            </div>
          ))
        )}
        {isTyping && typingUser && (
          <div className="chat chat-start">
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={typingUser.profilePicture || '/avatar.png'} alt='Profile Picture' />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <span className='text-sm font-semibold'>{typingUser.fullName}</span>
            </div>
            <div className='chat-bubble bg-base-200'>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput isGroup={true} />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default GroupChatContainer; 