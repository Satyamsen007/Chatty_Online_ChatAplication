import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { useGroupStore } from './useGroupStore';

export const useGroupChatStore = create((set, get) => ({
  groupMessages: [],
  selectedGroup: null,
  isMessagesLoading: false,
  isTyping: false,

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/group-messages/chat/${groupId}`);
      set({ groupMessages: response.data.data });
    } catch (error) {
      console.error('Error fetching group messages:', error);
      toast.error(error.response.data.message || "Something went wrong", {
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
      set({ isMessagesLoading: false });
    }
  },

  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    try {
      const response = await axiosInstance.post(`/group-messages/send/${selectedGroup._id}`, messageData);
      set({ groupMessages: [...groupMessages, response.data.data] });
    } catch (error) {
      console.error('Error sending group message:', error);
      toast.error(error.response.data.message || "Something went wrong", {
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

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/group/leave/${groupId}`);
      set({ selectedGroup: null, groupMessages: [] });
      // Update groups in useGroupStore
      const { groups } = useGroupStore.getState();
      useGroupStore.setState({
        groups: groups.filter(group => group._id !== groupId)
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  },

  removeMember: async (groupId, memberId) => {
    try {
      await axiosInstance.delete(`/group/${groupId}/members/${memberId}`);
      // Update the group members list
      const { selectedGroup } = get();
      if (selectedGroup) {
        set({
          selectedGroup: {
            ...selectedGroup,
            members: selectedGroup.members.filter(member => member._id !== memberId)
          }
        });
      }
      // Update groups in useGroupStore
      const { groups } = useGroupStore.getState();
      useGroupStore.setState({
        groups: groups.map(group => {
          if (group._id === groupId) {
            return {
              ...group,
              members: group.members.filter(member => member._id !== memberId)
            };
          }
          return group;
        })
      });
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/group/${groupId}`);
      set({ selectedGroup: null, groupMessages: [] });
      // Update groups in useGroupStore
      const { groups } = useGroupStore.getState();
      useGroupStore.setState({
        groups: groups.filter(group => group._id !== groupId)
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  listenForGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;
    const socket = useAuthStore.getState().socket;

    socket.off("new-group-message");
    socket.off("group-typing");
    socket.off("group-stop-typing");

    socket.on("new-group-message", (newMessage) => {
      if (newMessage.groupId === selectedGroup._id) {
        const currentMessages = get().groupMessages;
        if (!currentMessages.some(msg => msg._id === newMessage._id)) {
          if (newMessage.senderId && typeof newMessage.senderId === 'object') {
            set({ groupMessages: [...currentMessages, newMessage] });
          } else {
            axiosInstance.get(`/group-messages/chat/${selectedGroup._id}`)
              .then(response => {
                set({ groupMessages: response.data.data });
              })
              .catch(error => {
                console.error('Error fetching updated messages:', error);
              });
          }
        }
      }
    });

    socket.on("group-typing", ({ groupId, userId }) => {
      if (groupId === selectedGroup._id && userId !== useAuthStore.getState().authUser._id) {
        set({ isTyping: true });
      }
    });

    socket.on("group-stop-typing", ({ groupId, userId }) => {
      if (groupId === selectedGroup._id && userId !== useAuthStore.getState().authUser._id) {
        set({ isTyping: false });
      }
    });
  },

  unListenForGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("new-group-message");
      socket.off("group-typing");
      socket.off("group-stop-typing");
    }
  },

  setSelectedGroup: (group) => {
    set({ selectedGroup: group });
  },

  clearGroupMessages: () => {
    set({ groupMessages: [], selectedGroup: null });
  },

  addGroupMembers: async (groupId, memberIds) => {
    try {
      const response = await axiosInstance.post(`/group/${groupId}/members`, { members: memberIds });
      // Update the selected group with new members
      const { selectedGroup } = get();
      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: response.data.data });
      }
      // Update groups in useGroupStore
      const { groups } = useGroupStore.getState();
      useGroupStore.setState({
        groups: groups.map(group =>
          group._id === groupId ? response.data.data : group
        )
      });
      return response.data.data;
    } catch (error) {
      console.error('Error adding group members:', error);
      throw error;
    }
  },

  updateGroup: async (groupId, formData) => {
    try {
      const response = await axiosInstance.put(`/group/${groupId}`, formData);
      const updatedGroup = response.data.data;

      // Update the selected group if it's the one being edited
      const { selectedGroup } = get();
      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: updatedGroup });
      }

      // Update groups in useGroupStore
      const { groups } = useGroupStore.getState();
      useGroupStore.setState({
        groups: groups.map(group =>
          group._id === groupId ? updatedGroup : group
        )
      });

      // Emit socket event to notify all group members about the update
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit('join-group', groupId);
      }

      return updatedGroup;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }
})); 