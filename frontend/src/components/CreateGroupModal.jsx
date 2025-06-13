import React, { useState, useRef, useEffect } from 'react';
import { useGroupStore } from '../store/useGroupStore';
import { X, Smile } from 'lucide-react';
import { useFriendStore } from '../store/useFriendStore';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupPicture, setGroupPicture] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showNameEmojiPicker, setShowNameEmojiPicker] = useState(false);
  const [showDescEmojiPicker, setShowDescEmojiPicker] = useState(false);
  const { createGroup } = useGroupStore();
  const { friends } = useFriendStore()
  const fileInputRef = useRef(null);
  const nameEmojiRef = useRef(null);
  const descEmojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is on the emoji button or picker
      const isNameEmojiButton = event.target.closest('.name-emoji-button');
      const isDescEmojiButton = event.target.closest('.desc-emoji-button');
      const isNameEmojiPicker = event.target.closest('.name-emoji-picker');
      const isDescEmojiPicker = event.target.closest('.desc-emoji-picker');
      const isNameInput = event.target.closest('.name-input');
      const isDescInput = event.target.closest('.desc-input');

      if (!isNameEmojiButton && !isNameEmojiPicker && !isNameInput) {
        setShowNameEmojiPicker(false);
      }
      if (!isDescEmojiButton && !isDescEmojiPicker && !isDescInput) {
        setShowDescEmojiPicker(false);
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
      setGroupPicture(e.target.result);
    }
    reader.readAsDataURL(file);
  };

  const onEmojiClick = (emojiObject, setter) => {
    setter(prev => prev + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Please enter a group name", {
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

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member", {
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

    try {
      setIsCreating(true);
      await createGroup({
        name: groupName,
        description,
        members: selectedMembers,
        groupPicture
      });
      // Clear all fields after successful creation
      setGroupName('');
      setDescription('');
      setSelectedMembers([]);
      setGroupPicture(null);
      onClose();
    } catch (error) {
      // Error is already handled in the store
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create New Group</h2>
              <button onClick={onClose} className="btn btn-ghost btn-sm">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Group Name</span>
                </label>
                <div className="relative" ref={nameEmojiRef}>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="input input-bordered rounded-lg w-full pr-10 focus:outline-none focus:border-primary name-input"
                    placeholder="Enter group name"
                    required
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNameEmojiPicker(!showNameEmojiPicker);
                        setShowDescEmojiPicker(false);
                      }}
                      className="btn btn-ghost btn-sm name-emoji-button"
                    >
                      <Smile className="size-4" />
                    </button>
                    {showNameEmojiPicker && (
                      <div className="absolute -right-2 top-full mt-2 name-emoji-picker">
                        <EmojiPicker className='!w-[400px] max-md:!w-[300px] max-md:!h-[350px]' onEmojiClick={(emojiObject) => onEmojiClick(emojiObject, setGroupName)} theme="dark" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <div className="relative" ref={descEmojiRef}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered w-full pr-10 rounded-lg focus:outline-none focus:border-primary desc-input"
                    placeholder="Enter group description"
                    rows={3}
                  />
                  <div className="absolute right-2 top-2 z-20">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDescEmojiPicker(!showDescEmojiPicker);
                        setShowNameEmojiPicker(false);
                      }}
                      className="btn btn-ghost btn-sm desc-emoji-button"
                    >
                      <Smile className="size-4" />
                    </button>
                    {showDescEmojiPicker && (
                      <div className="absolute -right-2 top-full mt-2 desc-emoji-picker">
                        <EmojiPicker className='!w-[400px] max-md:!w-[300px] max-md:!h-[350px]' onEmojiClick={(emojiObject) => onEmojiClick(emojiObject, setDescription)} theme="dark" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Group Picture</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline w-full"
                >
                  Choose Image
                </button>
                {groupPicture && (
                  <div className="mt-2">
                    <img
                      src={groupPicture}
                      alt="Group Preview"
                      className="max-h-32 rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Select Members (at least 1 required)</span>
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {friends.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, user._id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== user._id));
                          }
                        }}
                        className="checkbox checkbox-sm"
                      />
                      <img
                        src={user.profilePicture || '/avatar.png'}
                        alt={user.fullName}
                        className="size-8 rounded-full"
                      />
                      <span>{user.fullName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!groupName.trim() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Group'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal; 