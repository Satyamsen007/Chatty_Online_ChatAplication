import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useFriendStore = create((set, get) => ({
  friendRequests: [],
  friends: [],
  sentFriendRequests: [],
  isFriendRequestsLoading: false,
  isFriendsLoading: false,

  initializeSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Listen for new friend requests
    socket.on("new-friend-request", (data) => {
      set(state => ({
        friendRequests: [...state.friendRequests, data]
      }));
    });

    socket.on("friend-request-update", (data) => {
      if (data.status === 'accepted') {
        get().getFriends();
      }
      set(state => ({
        friendRequests: state.friendRequests.filter(req => req._id !== data.requestId),
        sentFriendRequests: state.sentFriendRequests.filter(req => req._id !== data.requestId)
      }));
    });
  },

  getFriendRequests: async () => {
    set({ isFriendRequestsLoading: true });
    try {
      const response = await axiosInstance.get('/friend-requests');
      set({ friendRequests: response.data.data });
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast.error(error.response?.data?.message || "Something went wrong", {
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
      set({ isFriendRequestsLoading: false });
    }
  },

  getSentFriendRequests: async () => {
    try {
      const response = await axiosInstance.get('/friend-requests/sent');
      set({ sentFriendRequests: response.data.data });
    } catch (error) {
      console.error('Error fetching sent friend requests:', error);
      toast.error(error.response?.data?.message || "Something went wrong", {
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
  },

  getFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const response = await axiosInstance.get('/friend-requests/friends');
      set({ friends: response.data.data });
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error(error.response?.data?.message || "Failed to fetch friends", {
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
      set({ isFriendsLoading: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      const response = await axiosInstance.post(`/friend-requests/send/${receiverId}`);
      // Create a new request object with the receiverId
      const newRequest = {
        _id: response.data.data._id,
        receiverId: { _id: receiverId },
        status: 'pending'
      };

      // Immediately update the state with the new request
      set(state => ({
        sentFriendRequests: [...state.sentFriendRequests, newRequest]
      }));

      toast.success("Friend request sent successfully", {
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
      return response.data.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.message || "Something went wrong", {
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
      throw error;
    }
  },

  handleFriendRequest: async (requestId, action) => {
    try {
      const response = await axiosInstance.put(`/friend-requests/${requestId}`, { action });

      // Remove the request from both received and sent requests
      set(state => ({
        friendRequests: state.friendRequests.filter(req => req._id !== requestId),
        sentFriendRequests: (state.sentFriendRequests || []).filter(req => req._id !== requestId)
      }));

      if (action === 'accept') {
        // Refresh friends list after accepting a request
        get().getFriends();
      }

      toast.success(
        action === 'accept'
          ? "Friend request accepted successfully"
          : "Friend request rejected successfully"
        , {
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
      return response.data.data;
    } catch (error) {
      console.error('Error handling friend request:', error);
      toast.error(error.response?.data?.message || "Something went wrong", {
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
      throw error;
    }
  }
})); 