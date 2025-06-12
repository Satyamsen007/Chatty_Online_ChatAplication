import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useGroupStore = create((set) => ({
  groups: [],
  isGroupsLoading: false,

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const response = await axiosInstance.get('/group');
      set({ groups: response.data.data });
    } catch (error) {
      console.error('Error fetching groups:', error);
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
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await axiosInstance.post('/group/create', groupData);
      set(state => ({
        groups: [...state.groups, response.data.data]
      }));
      toast.success("Group created successfully", {
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
      console.error('Error creating group:', error);
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

})); 