import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User, Edit2, Check, X, Loader2, CheckCircle2, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDone, setShowDone] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!isUpdatingProfile && isNameUpdating) {
      setIsNameUpdating(false);
      setIsEditingName(false);
    }
  }, [isUpdatingProfile]);

  useEffect(() => {
    let interval;
    if (isImageUploading && isUpdatingProfile) {
      setUploadProgress(0);
      interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
    } else if (uploadProgress > 0 && !isUpdatingProfile) {
      setUploadProgress(100);
      setShowDone(true);
      const timer = setTimeout(() => {
        setShowDone(false);
        setUploadProgress(0);
        setIsImageUploading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isUpdatingProfile, isImageUploading]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImageUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      updateProfile({ profilePic: base64Image });
    }
  }

  const handleNameEdit = () => {
    setNewFullName(authUser?.fullName || '');
    setIsEditingName(true);
  }

  const handleNameSave = async () => {
    if (newFullName.trim() && newFullName !== authUser?.fullName) {
      setIsNameUpdating(true);
      await updateProfile({ fullName: newFullName.trim() });
    } else {
      setIsEditingName(false);
    }
  }

  const handleNameCancel = () => {
    setIsEditingName(false);
    setNewFullName('');
    setShowEmojiPicker(false);
  }

  const onEmojiClick = (emojiData) => {
    setNewFullName(prev => prev + emojiData.emoji);
  };

  return (
    <>
      <Helmet>
        <title>Chatty | Your Profile, Your Vibe</title>
        <meta
          name="description"
          content="Welcome to your Chatty profile! Customize your avatar, update your info, and manage your chat experience—all in one smooth, modern dashboard."
        />
      </Helmet>
      <motion.div
        className='h-screen pt-20'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='max-w-2xl mx-auto p-4 py-8'>
          <motion.div
            className='bg-base-300 rounded-xl p-6 space-y-8'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className='text-center'>
              <h1 className='text-2xl font-semibold'>Profile</h1>
              <p className='mt-2'>Your profile information</p>
            </div>
            {/* avatar upload section */}
            <div className='flex flex-col items-center gap-4'>
              <div className='relative'>
                <div className='relative size-32'>
                  <img
                    src={selectedImage || authUser?.profilePicture || '/avatar.png'}
                    alt="Profile"
                    className={`size-32 rounded-full object-contain border-4 transition-all duration-300 ${isImageUploading && isUpdatingProfile ? 'opacity-50' : ''}`}
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isImageUploading && isUpdatingProfile ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageUpload}
                    disabled={isImageUploading && isUpdatingProfile}
                  />
                </label>
              </div>
              <div className='text-center space-y-3'>
                {isImageUploading && isUpdatingProfile && !showDone && (
                  <div className='flex flex-col items-center gap-2'>
                    <div className='relative size-12'>
                      <div className='absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin'></div>
                      <div className='absolute inset-0 flex items-center justify-center text-sm font-medium'>
                        {uploadProgress}%
                      </div>
                    </div>
                    <div className='w-48 h-1.5 bg-base-200 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-primary transition-all duration-300 ease-in-out'
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {showDone && (
                  <div className='flex flex-col items-center gap-2 animate-fade-in'>
                    <div className='text-primary'>
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <p className='text-sm font-medium text-primary'>Upload Complete!</p>
                  </div>
                )}
                <p className='text-sm text-base-content/70'>
                  {isImageUploading && isUpdatingProfile ? (
                    <span className='flex items-center justify-center'>
                      Uploading profile picture...
                    </span>
                  ) : (
                    'Click the camera icon to update your profile picture'
                  )}
                </p>
              </div>
            </div>
            {/* User information section */}
            <div className='space-y-6'>
              <div className='space-y-1.5 select-none'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  Full Name
                </div>
                {isEditingName ? (
                  <div className='flex items-center gap-2'>
                    <div className='relative flex-1'>
                      <input
                        type="text"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className='w-full px-4 py-2.5 bg-base-200 rounded-lg border focus:outline-none focus:border-primary'
                        placeholder="Enter your full name"
                        disabled={isNameUpdating}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className='absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-base-300 rounded-lg transition-colors'
                        disabled={isNameUpdating}
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      {showEmojiPicker && (
                        <div className='absolute right-0 top-full mt-2 z-10'>
                          <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            width={300}
                            height={400}
                            theme="dark"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleNameSave}
                      disabled={isNameUpdating}
                      className='p-2.5 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                    >
                      {isNameUpdating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleNameCancel}
                      disabled={isNameUpdating}
                      className='p-2.5 bg-error text-error-content rounded-lg hover:bg-error-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className='flex items-center justify-between px-4 py-2.5 bg-base-200 rounded-lg border'>
                    <p>{authUser?.fullName}</p>
                    <button
                      onClick={handleNameEdit}
                      disabled={isUpdatingProfile}
                      className='p-1.5 hover:bg-base-300 rounded-lg transition-colors cursor-pointer'
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className='space-y-1.5 select-none'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <Mail className='w-4 h-4' />
                  Email Address
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email}</p>
              </div>
            </div>

            {/* additional information section */}
            <div className='mt-6 bg-base-300 rounded-xl p-6'>
              <h2 className='text-lg font-medium mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                  <span>Member Since</span>
                  <span>
                    {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'Not available'}
                  </span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account Status</span>
                  <span className='text-green-500'>Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>

  )
}

export default ProfilePage;
