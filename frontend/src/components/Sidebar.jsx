import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users, Plus, UserPlus, UserCheck, Bell, Clock, Menu, Search, X, Pencil, UsersRound } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFriendStore } from '../store/useFriendStore';
import { useGroupStore } from '../store/useGroupStore';
import CreateGroupModal from './CreateGroupModal';
import FriendRequestsModal from './FriendRequestsModal';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'
import { useGroupChatStore } from '../store/useGroupChatStore';
import GroupSkeleton from './skeletons/GroupSkeleton';
import FriendSkeleton from './skeletons/FriendSkeleton';
const Sidebar = () => {
  const { getUsers, users, selectedUser, isUsersLoading, setSelectedUser } = useChatStore();
  const { setSelectedGroup, selectedGroup } = useGroupChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const { groups, getGroups, isGroupsLoading } = useGroupStore();
  const {
    sendFriendRequest,
    friends,
    friendRequests,
    getFriendRequests,
    getFriends,
    initializeSocketListeners,
    sentFriendRequests,
    getSentFriendRequests,
    isFriendsLoading
  } = useFriendStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isFriendRequestsModalOpen, setIsFriendRequestsModalOpen] = useState(false);
  const [sendingRequestTo, setSendingRequestTo] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    getUsers();
    getFriendRequests();
    getFriends();
    getSentFriendRequests();
    getGroups();
    initializeSocketListeners();
  }, [getUsers, getFriendRequests, getFriends, getSentFriendRequests, getGroups, initializeSocketListeners]);

  // Load groups when switching to groups tab
  useEffect(() => {
    if (activeTab === 'groups') {
      getGroups();
    } else if (activeTab === 'friends') {
      getFriends();
    } else if (activeTab === 'all') {
      getUsers();
    }
  }, [activeTab, getGroups, getFriends]);

  const handleSendFriendRequest = async (userId) => {
    if (sendingRequestTo === userId) return;
    setSendingRequestTo(userId);
    try {
      await sendFriendRequest(userId);
    } catch (error) {
      // Already handle in store
    } finally {
      setSendingRequestTo(null);
    }
  };

  const isRequestSent = (userId) => {
    return sentFriendRequests?.some(request =>
      request.receiverId?._id === userId || request.receiverId === userId
    );
  };

  const filteredUsers = showOnlineOnly
    ? users.filter(user => onlineUsers.includes(user._id))
    : users;

  const displayUsers = activeTab === 'friends'
    ? filteredUsers.filter(user => friends.some(friend => friend._id === user._id))
    : activeTab === 'groups'
      ? [] // We'll handle groups separately
      : filteredUsers;

  const searchFilteredUsers = displayUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFilteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFilteredFreinds = displayUsers.filter(friend =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    if (activeTab === 'groups') {
      if (isGroupsLoading) return <GroupSkeleton />;
      if (searchFilteredGroups.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <UsersRound className="size-16 text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
            <p className="text-base-content/70 text-sm">
              Create a new group to start chatting
            </p>
          </div>
        );
      }
      return searchFilteredGroups.map((group) => (
        <div
          key={group._id}
          className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer"
          onClick={() => {
            setSelectedGroup(group);
            setIsSidebarOpen(false);
          }}
        >
          <div className='relative'>
            <img
              src={group.groupPicture || '/avatar.png'}
              alt={group.name}
              className='size-12 rounded-full object-contain'
            />
          </div>
          <div className='text-left min-w-0'>
            <div className='font-medium truncate'>{group.name}</div>
            <div className='text-sm text-base-content/70'>
              {group.members.length} members
            </div>
          </div>
        </div>
      ));
    }

    if (activeTab === 'friends') {
      if (isFriendsLoading) return <FriendSkeleton />;
      if (searchFilteredFreinds.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <UserCheck className="size-16 text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
            <p className="text-base-content/70 text-sm">
              Add friends to start chatting with them
            </p>
          </div>
        );
      }
      return searchFilteredFreinds.map((user) => (
        <div
          key={user._id}
          className={`w-full p-3 flex items-center justify-between gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}
        >
          <button
            onClick={() => {
              setSelectedUser(user);
              setIsSidebarOpen(false);
            }}
            className="flex items-center cursor-pointer gap-3 flex-1"
          >
            <div className='relative'>
              <img
                src={user?.profilePicture || '/avatar.png'}
                alt={user?.fullName}
                className='size-12 rounded-full object-contain ring-2 ring-primary'
              />
            </div>
            <div className='text-left min-w-0'>
              <div className='font-medium truncate'>{user.fullName}</div>
              <div className='text-sm text-base-content/70'>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
          <button className="btn btn-ghost btn-sm" title="Friend">
            <UserCheck className="size-4 text-success" />
          </button>
        </div>
      ));
    }

    if (activeTab === 'all') {
      if (isUsersLoading) return <SidebarSkeleton />;
      if (searchFilteredUsers.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="size-16 text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
            <p className="text-base-content/70 text-sm">
              No users match your current filters
            </p>
          </div>
        );
      }
      return searchFilteredUsers.map((user) => (
        <div
          key={user._id}
          className={`w-full p-3 flex items-center justify-between gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}
        >
          <button
            onClick={() => {
              if (friends.some(friend => friend._id === user._id)) {
                setSelectedUser(user);
                setSelectedGroup(null);
                setIsSidebarOpen(false);
              } else {
                toast.error("You can only chat with your friends. Send a friend request first!", {
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
              }
            }}
            className="flex items-center cursor-pointer gap-3 flex-1"
          >
            <div className='relative'>
              <img
                src={user?.profilePicture || '/avatar.png'}
                alt={user?.fullName}
                className='size-12 rounded-full object-contain ring-2 ring-primary'
              />
              <span
                className={`absolute bottom-0 right-0 size-3 rounded-full ${onlineUsers.includes(user._id) && 'bg-success'
                  }`}
              />
            </div>
            <div className='text-left min-w-0'>
              <div className='font-medium truncate'>{user.fullName}</div>
              <div className='text-sm text-base-content/70'>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
          {friends.some(friend => friend._id === user._id) ? (
            <button className="btn btn-ghost btn-sm" title="Friend">
              <UserCheck className="size-4 text-success" />
            </button>
          ) : isRequestSent(user._id) ? (
            <button className="btn btn-ghost btn-sm" title="Friend Request Sent">
              <Clock className="size-4 text-warning" />
            </button>
          ) : (
            <button
              onClick={() => handleSendFriendRequest(user._id)}
              className="btn btn-ghost btn-sm"
              title="Send Friend Request"
              disabled={sendingRequestTo === user._id}
            >
              {sendingRequestTo === user._id ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <UserPlus className="size-4" />
              )}
            </button>
          )}
        </div>
      ));
    }

    return null; // fallback
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-base-200">
      {/* User Profile Section */}
      <div className="p-4 border-b border-base-300">
        <div className="flex flex-col items-center justify-center gap-3 mb-4">
          <div className="relative">
            <img
              src={authUser?.profilePicture || '/avatar.png'}
              alt={authUser?.fullName}
              className="size-20 rounded-full object-contain ring-4 ring-primary"
            />
            <button onClick={() => navigate('/profile')} className="absolute cursor-pointer bottom-0 right-0 p-[6px] bg-primary text-primary-content rounded-full">
              <Pencil className="size-[14px]" />
            </button>
          </div>
          <div className="text-center">
            <h3 className="font-medium">{authUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">{authUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFriendRequestsModalOpen(true)}
              className="btn btn-ghost btn-sm relative"
              title="Friend Requests"
            >
              <motion.div
                animate={friendRequests.length > 0 ? {
                  rotate: [0, -15, 15, -15, 15, 0],
                  transition: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }
                } : {}}
              >
                <Bell className="size-5" />
              </motion.div>
              {friendRequests.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {friendRequests.length}
                </motion.span>
              )}
            </button>
            <button
              onClick={() => setIsCreateGroupModalOpen(true)}
              className="btn btn-ghost btn-sm"
              title="Create Group"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50" />
          <input
            type="text"
            placeholder={activeTab === 'groups' ? "Search groups..." : "Search users..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered rounded-lg !outline-none w-full px-3"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-between max-sm:justify-center max-sm:flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`btn rounded-md btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Users className="size-4 mr-2" />
            All Users
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`btn rounded-md btn-sm ${activeTab === 'friends' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <UserCheck className="size-4 mr-2" />
            Friends
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`btn rounded-md btn-sm ${activeTab === 'groups' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <UsersRound className="size-4 mr-2" />
            Groups
          </button>
        </div>

        {activeTab !== 'groups' && (
          <div className='flex items-center gap-2'>
            <Users className='w-6 h-6' />
            <span className='font-medium'>Contacts</span>
          </div>
        )}
        {activeTab !== 'groups' && (
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm rounded-full"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
          </div>
        )}
      </div>

      <div className='overflow-y-auto w-full py-3'>
        {renderTabContent()}
      </div>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
      <FriendRequestsModal
        isOpen={isFriendRequestsModalOpen}
        onClose={() => setIsFriendRequestsModalOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="sm:hidden">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          hidden={!authUser}
          className="fixed top-4 left-4 z-50 btn btn-ghost btn-sm"
        >
          <Menu className="size-5" />
        </button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
          )}
        </AnimatePresence>

        {/* Mobile Sliding Sidebar */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isSidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed inset-y-0 left-0 w-[80%] z-50"
        >
          <div className="relative h-full bg-base-200">
            {sidebarContent}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 btn btn-ghost btn-sm"
            >
              <X className="size-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:block w-[340px] h-full bg-base-200">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;