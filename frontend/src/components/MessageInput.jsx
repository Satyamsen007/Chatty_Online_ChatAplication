import { Image, Send, X, Smile } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useGroupChatStore } from '../store/useGroupChatStore';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { useAuthStore } from '../store/useAuthStore';

const MessageInput = ({ isGroup = false }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { sendGroupMessage, selectedGroup } = useGroupChatStore();
  const { socket } = useAuthStore();
  const typingTimeoutRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--er))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '❌',
        duration: 4000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--er))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '❌',
        duration: 4000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    }
    reader.readAsDataURL(file);
  }

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  const handleTyping = () => {
    if (isGroup) {
      if (!selectedGroup) return;
      socket.emit('group-typing', { groupId: selectedGroup._id });
    } else {
      if (!selectedUser) return;
      socket.emit('typing', selectedUser._id);
    }

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      if (isGroup) {
        socket.emit('group-stop-typing', { groupId: selectedGroup._id });
      } else {
        socket.emit('stop-typing', selectedUser._id);
      }
    }, 2000);
  };

  const onEmojiClick = (emojiObject) => {
    setContent(prevContent => prevContent + emojiObject.emoji);
    handleTyping(); // Trigger typing indicator when emoji is selected
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;
    if (isSending) return;

    try {
      setIsSending(true);
      const messageData = {
        content: content.trim(),
        image: imagePreview,
      };

      if (isGroup) {
        await sendGroupMessage(messageData);
      } else {
        await sendMessage(messageData);
      }

      setContent('');
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error);
      toast.error("Failed to send message. Please try again.", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--er))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className='p-4 w-full'>
      {
        imagePreview && (
          <div className='mb-3 flex items-center gap-2'>
            <div className='relative'>
              <img src={imagePreview} alt="Preview" className='w-20 h-20 object-contain rounded-lg border border-zinc-700' />
              <button className='absolute -top-1.5 cursor-pointer -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center' type='button' onClick={removeImage}>
                <X className='size-3' />
              </button>
            </div>
          </div>
        )
      }
      <div className='relative'>
        {showEmojiPicker && (
          <div className='absolute lg:right-0 bottom-full mb-2' ref={emojiPickerRef}>
            <EmojiPicker className='!w-[400px] max-md:!w-[95%] max-md:!h-[350px]' onEmojiClick={onEmojiClick} theme='dark' />
          </div>
        )}
        <form onSubmit={handleSendMessage} className='flex items-center justify-center gap-2'>
          <div className='flex-1 flex items-center justify-center gap-2'>
            <input
              type="text"
              placeholder={`Type a message${isGroup ? ' to group' : ''}...`}
              className='w-full input input-bordered rounded-lg input-sm sm:input-md'
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                handleTyping();
              }}
            />
            <input type="file" accept='image/*' ref={fileInputRef} className='hidden' onChange={handleImageChange} />
            <button
              className={`btn btn-circle max-md:w-8 max-md:h-8 hover:bg-primary hover:text-primary-content ${showEmojiPicker ? 'bg-primary text-primary-content' : 'text-zinc-400'} flex items-center justify-center`}
              type='button'
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className='size-[14px] lg:size-[20px]' />
            </button>
            <button
              className={`btn btn-circle max-md:w-8 max-md:h-8 hover:bg-primary hover:text-primary-content ${imagePreview ? 'text-primary' : 'text-zinc-400'} flex items-center justify-center`}
              type='button'
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className='size-[14px] lg:size-[20px]' />
            </button>
          </div>
          <button
            type='submit'
            className={`btn btn-primary max-md:w-10 max-md:p-0 max-md:h-8 flex items-center justify-center rounded-lg cursor-pointer disabled:cursor-not-allowed ${isSending ? 'relative' : ''}`}
            disabled={(!content.trim() && !imagePreview) || isSending}
          >
            {!isSending ? (
              <Send className="size-[18px] max-md:size-[14px]" />
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 max-md:w-1 max-md:h-1 rounded-full bg-primary-content animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 max-md:w-1 max-md:h-1 rounded-full bg-primary-content animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 max-md:w-1 max-md:h-1 rounded-full bg-primary-content animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput;