import React, { useState, useRef, useEffect } from 'react';
import { X, Users, Crown, LogOut, UserPlus, AlertCircle, Shield, Trash2, UserPlus2, Check, Loader2, Search, Edit2, Save, Camera, Smile, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useGroupChatStore } from '../store/useGroupChatStore';
import { useFriendStore } from '../store/useFriendStore';
import { useGroupStore } from '../store/useGroupStore';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const GroupDetailsModal = ({ isOpen, onClose, group }) => {
  const { authUser } = useAuthStore();
  const { leaveGroup, removeMember, deleteGroup, addGroupMembers, updateGroup } = useGroupChatStore();
  const { friends, sendFriendRequest, sentFriendRequests } = useFriendStore();
  const { getGroups } = useGroupStore();
  const isAdmin = group?.admins?.some((admin) => admin._id === authUser._id);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showNameEmojiPicker, setShowNameEmojiPicker] = useState(false);
  const [showDescEmojiPicker, setShowDescEmojiPicker] = useState(false);
  const nameEmojiRef = useRef(null);
  const descEmojiRef = useRef(null);

  // Fetch complete group data when modal opens
  useEffect(() => {
    const fetchGroupData = async () => {
      if (isOpen && group?._id) {
        setIsLoading(true);
        try {
          await getGroups();
        } catch (error) {
          console.error('Error fetching group data:', error);
          toast.error('Failed to load group data', {
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
          setIsLoading(false);
        }
      }
    };

    fetchGroupData();
  }, [isOpen, group?._id, getGroups]);

  // Update edited states when group changes
  useEffect(() => {
    if (group) {
      setEditedName(group.name || '');
      setEditedDescription(group.description || '');
      setPreviewUrl(group.groupPicture || null);
    }
  }, [group]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      setSearchQuery('');
      setSelectedFriends([]);
      setShowAddMembers(false);
      setShowDeleteConfirm(false);
      setMemberToRemove(null);
    }
  }, [isOpen]);

  // Filter out friends who are already members
  const availableFriends = friends.filter(friend =>
    !group?.members?.some(member => member._id === friend._id)
  );

  // Filter friends based on search query
  const filteredFriends = availableFriends.filter(friend =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLeaveGroup = async () => {
    try {
      setIsLeaving(true);
      await leaveGroup(group._id);
      toast.success("Left the group successfully", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--p))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '✨',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave group", {
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
      setIsLeaving(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setIsRemoving(true);
      await removeMember(group._id, memberId);
      toast.success("Member removed successfully", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--p))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '✨',
        duration: 3000,
      });
      setMemberToRemove(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member", {
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
      setIsRemoving(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setIsDeleting(true);
      await deleteGroup(group._id);
      toast.success("Group deleted successfully", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--p))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '✨',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group", {
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
      setIsDeleting(false);
    }
  };

  const handleFriendRequest = async (memberId) => {
    try {
      setLoadingRequests(prev => ({ ...prev, [memberId]: true }));
      await sendFriendRequest(memberId);
    } catch (error) {
      // Already handle in Store
    } finally {
      setLoadingRequests(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const isFriend = (memberId) => {
    return friends.some(friend => friend._id === memberId);
  };

  const isRequestSent = (userId) => {
    return sentFriendRequests?.some(request =>
      request.receiverId?._id === userId || request.receiverId === userId
    );
  };

  const getFriendButton = (member) => {
    if (member._id === authUser._id) return null;
    if (isFriend(member._id)) return null;

    if (loadingRequests[member._id]) {
      return (
        <button className="btn btn-ghost btn-sm btn-circle" disabled>
          <Loader2 className="size-4 animate-spin text-base-content/70" />
        </button>
      );
    }

    if (isRequestSent(member._id)) {
      return (
        <button
          className="btn btn-ghost btn-sm btn-circle text-warning hover:bg-warning/10"
          title="Friend Request Sent"
        >
          <Clock className="size-4" />
        </button>
      );
    }

    return (
      <button
        onClick={() => handleFriendRequest(member._id)}
        className="btn btn-ghost btn-sm btn-circle text-primary hover:bg-primary/10"
        title="Add Friend"
      >
        <UserPlus2 className="size-4" />
      </button>
    );
  };

  // Find admin members
  const adminMembers = group?.members?.filter(member => group.admins?.some((admin) => admin._id === member._id));

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend to add", {
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
      setIsAddingMembers(true);
      await addGroupMembers(group._id, selectedFriends);
      toast.success("Members added successfully", {
        style: {
          background: 'hsl(var(--b1))',
          color: 'hsl(var(--bc))',
          borderColor: 'hsl(var(--p))',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        icon: '✨',
        duration: 3000,
      });
      setShowAddMembers(false);
      setSelectedFriends([]);
      setSearchQuery('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add members", {
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
      setIsAddingMembers(false);
    }
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateGroup = async () => {
    if (!editedName.trim()) {
      toast.error("Group name cannot be empty", {
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

    // Check if any changes were made
    const hasNameChanged = editedName.trim() !== group.name;
    const hasDescriptionChanged = editedDescription.trim() !== group.description;
    const hasPictureChanged = previewUrl !== group.groupPicture;

    if (!hasNameChanged && !hasDescriptionChanged && !hasPictureChanged) {
      toast.error("No changes were made", {
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
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      const updateData = {
        name: editedName.trim(),
        description: editedDescription.trim(),
      };

      // Only include groupPicture in the update if it has changed
      if (hasPictureChanged) {
        updateData.groupPicture = previewUrl;
      }

      await updateGroup(group._id, updateData);
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      // Already Handle in Store
    } finally {
      setIsUpdating(false);
    }
  };

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

  const onEmojiClick = (emojiObject, setter) => {
    setter(prev => prev + emojiObject.emoji);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-base-100 rounded-xl w-[95%] sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Users className="size-4 sm:size-5 text-primary" />
                Group Details
              </h2>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle hover:bg-base-300">
                <X className="size-4 sm:size-5" />
              </button>
            </div>

            {/* Group Info */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="flex flex-col items-center mb-4 sm:mb-6">
                <div className="avatar mb-2 sm:mb-3 relative group">
                  <div className="size-24 sm:size-32 rounded-full">
                    <img
                      src={previewUrl || group?.groupPicture || "/avatar.png"}
                      alt={group?.name}
                      className="object-contain"
                    />
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="size-8 text-white" />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {isEditing ? (
                  <div className="w-full max-w-sm space-y-3 mb-8">
                    <div className="form-control">
                      <div className="relative" ref={nameEmojiRef}>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Group Name"
                          className="input input-bordered w-full pr-10 name-input"
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
                              <EmojiPicker className='!w-[400px] max-md:!w-[300px] max-md:!h-[350px]' onEmojiClick={(emojiObject) => onEmojiClick(emojiObject, setEditedName)} theme="dark" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-control">
                      <div className="relative" ref={descEmojiRef}>
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Group Description"
                          className="textarea textarea-bordered w-full pr-10 desc-input"
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
                              <EmojiPicker className='!w-[400px] max-md:!w-[300px] max-md:!h-[350px]' onEmojiClick={(emojiObject) => onEmojiClick(emojiObject, setEditedDescription)} theme="dark" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(group?.name || '');
                          setEditedDescription(group?.description || '');
                          setSelectedImage(null);
                          setPreviewUrl(null);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateGroup}
                        disabled={isUpdating}
                        className="btn btn-primary btn-sm gap-2"
                      >
                        {isUpdating ? (
                          <Loader2 className="size-3 sm:size-4 animate-spin" />
                        ) : (
                          <Save className="size-3 sm:size-4" />
                        )}
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">{group?.name}</h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
                      >
                        <Edit2 className="size-4 text-base-content/70" />
                      </button>
                    </div>
                    {group?.description && (
                      <p className="text-sm sm:text-base text-base-content/70 text-center mb-3 max-w-sm">
                        {group.description}
                      </p>
                    )}
                  </>
                )}

                <div className="flex items-center gap-2 text-sm sm:text-base text-base-content/70 bg-base-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <Users className="size-3 sm:size-4" />
                  <span>{group?.members?.length || 0} members</span>
                </div>
              </div>

              {/* Admins Section */}
              {adminMembers && adminMembers.length > 0 && (
                <div className="mb-4 p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Shield className="size-4 sm:size-5 text-primary" />
                    <h4 className="font-medium text-base sm:text-lg">Group Admin</h4>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {adminMembers.map((admin) => (
                      <div key={admin._id} className="flex items-center gap-2 sm:gap-3">
                        <div className="avatar">
                          <div className="size-12 sm:size-14 rounded-full">
                            <img
                              src={admin.profilePicture || "/avatar.png"}
                              alt={admin.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                            {admin.fullName}
                            <Crown className="size-3 sm:size-4 text-primary" />
                          </p>
                          <p className="text-xs sm:text-sm text-base-content/70">
                            Group Administrator
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members List */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-base sm:text-lg">
                  <Users className="size-4 sm:size-5 text-primary" />
                  Members
                </h4>
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                  ) : group?.members?.length > 0 ? (
                    group.members.map((member) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-base-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="avatar">
                            <div className="size-10 sm:size-12 rounded-full">
                              <img
                                src={member.profilePicture || "/avatar.png"}
                                alt={member.fullName}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                              {member.fullName}
                              {group.admins?.some(admin => admin._id === member._id) && (
                                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-base-content/70">
                              Member
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {getFriendButton(member)}
                          {isAdmin && member._id !== authUser._id && !group.admins?.includes(member._id) && (
                            <button
                              onClick={() => setMemberToRemove(member)}
                              className="btn btn-ghost btn-xs sm:btn-sm text-error hover:bg-error/10"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-base-content/70 py-4">
                      No members found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 sm:p-4 border-t border-base-300 flex justify-between bg-base-200/50">
              {isAdmin ? (
                <button
                  onClick={() => setShowAddMembers(true)}
                  className="btn btn-primary btn-xs sm:btn-sm gap-1 sm:gap-2"
                >
                  <UserPlus className="size-3 sm:size-4" />
                  Add Members
                </button>
              ) : (
                <button
                  onClick={handleLeaveGroup}
                  disabled={isLeaving}
                  className="btn btn-error btn-xs sm:btn-sm gap-1 sm:gap-2"
                >
                  {isLeaving ? (
                    <Loader2 className="size-3 sm:size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-3 sm:size-4" />
                  )}
                  {isLeaving ? "Leaving..." : "Leave Group"}
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="btn btn-error btn-xs sm:btn-sm gap-1 sm:gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="size-3 sm:size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-3 sm:size-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Group"}
                </button>
              )}
            </div>
          </motion.div>

          {/* Confirmation Modal for Removing Member */}
          <AnimatePresence>
            {memberToRemove && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-3 sm:p-4"
                onClick={() => setMemberToRemove(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-base-100 rounded-xl p-4 sm:p-6 max-w-[95%] sm:max-w-sm w-full shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <AlertCircle className="size-5 sm:size-6 text-error" />
                    <h3 className="text-base sm:text-lg font-semibold">Remove Member</h3>
                  </div>
                  <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">
                    Are you sure you want to remove <span className="font-medium text-base-content">{memberToRemove.fullName}</span> from the group?
                  </p>
                  <div className="flex justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => setMemberToRemove(null)}
                      className="btn btn-ghost btn-xs sm:btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRemoveMember(memberToRemove._id)}
                      disabled={isRemoving}
                      className="btn btn-error btn-xs sm:btn-sm"
                    >
                      {isRemoving ? (
                        <Loader2 className="size-3 sm:size-4 animate-spin" />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirmation Modal for Deleting Group */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-base-100 rounded-xl p-4 sm:p-6 max-w-[95%] sm:max-w-sm w-full shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <AlertCircle className="size-5 sm:size-6 text-error" />
                    <h3 className="text-base sm:text-lg font-semibold">Delete Group</h3>
                  </div>
                  <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">
                    Are you sure you want to delete this group? This action cannot be undone and all messages will be permanently deleted.
                  </p>
                  <div className="flex justify-end gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn btn-ghost btn-xs sm:btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteGroup}
                      disabled={isDeleting}
                      className="btn btn-error btn-xs sm:btn-sm"
                    >
                      {isDeleting ? (
                        <Loader2 className="size-3 sm:size-4 animate-spin" />
                      ) : (
                        "Delete Group"
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Members Modal */}
          <AnimatePresence>
            {showAddMembers && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowAddMembers(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-base-100 rounded-xl w-[95%] sm:w-[85%] md:w-[500px] max-h-[90vh] overflow-hidden shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-3 sm:p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                      <UserPlus className="size-4 sm:size-5 text-primary" />
                      Add Members
                    </h2>
                    <button
                      onClick={() => setShowAddMembers(false)}
                      className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
                    >
                      <X className="size-4 sm:size-5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="p-3 sm:p-4 border-b border-base-300">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full pl-8 sm:pl-10 text-sm sm:text-base"
                      />
                      <Search className="size-4 sm:size-5 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                    </div>
                  </div>

                  {/* Friends List */}
                  <div className="p-3 sm:p-4 overflow-y-auto max-h-[50vh]">
                    {filteredFriends.length === 0 ? (
                      <div className="text-center text-sm sm:text-base text-base-content/70 py-6 sm:py-8">
                        {searchQuery ? "No friends found matching your search" : "No friends available to add"}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredFriends.map((friend) => (
                          <motion.div
                            key={friend._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-base-200 transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="avatar">
                                <div className="size-10 sm:size-12 rounded-full">
                                  <img
                                    src={friend.profilePicture || "/avatar.png"}
                                    alt={friend.fullName}
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-sm sm:text-base">{friend.fullName}</p>
                                <p className="text-xs sm:text-sm text-base-content/70">Friend</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleFriendSelection(friend._id)}
                              className={`btn btn-xs sm:btn-sm ${selectedFriends.includes(friend._id)
                                ? "btn-primary"
                                : "btn-ghost"
                                }`}
                            >
                              {selectedFriends.includes(friend._id) ? (
                                <Check className="size-3 sm:size-4" />
                              ) : (
                                "Select"
                              )}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-3 sm:p-4 border-t border-base-300 flex justify-end gap-2 sm:gap-3 bg-base-200/50">
                    <button
                      onClick={() => setShowAddMembers(false)}
                      className="btn btn-ghost btn-xs sm:btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMembers}
                      disabled={isAddingMembers || selectedFriends.length === 0}
                      className="btn btn-primary btn-xs sm:btn-sm gap-1 sm:gap-2"
                    >
                      {isAddingMembers ? (
                        <Loader2 className="size-3 sm:size-4 animate-spin" />
                      ) : (
                        <UserPlus className="size-3 sm:size-4" />
                      )}
                      {isAddingMembers ? "Adding..." : "Add Selected"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GroupDetailsModal; 