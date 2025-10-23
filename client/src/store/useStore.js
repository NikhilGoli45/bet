import { create } from 'zustand';
import { io } from 'socket.io-client';
import apiService from '../services/apiService';

const useStore = create((set, get) => ({
  // State
  currentUser: null,
  currentGroup: null,
  groups: [],
  rules: [],
  events: [],
  leaderboard: [],
  socket: null,
  loading: false,
  error: null,

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setCurrentGroup: (group) => {
    set({ currentGroup: group });
    // Join socket room when group changes
    const { socket } = get();
    if (socket && group) {
      socket.emit('join_group', group.id);
    }
  },

  setGroups: (groups) => set({ groups }),
  
  setRules: (rules) => set({ rules }),
  
  setEvents: (events) => set({ events }),
  
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  // Initialize socket connection
  initializeSocket: () => {
    const socket = io('http://localhost:3000');
    
    socket.on('event_added', (event) => {
      const { events } = get();
      set({ events: [...events, event] });
    });

    socket.on('veto_update', (event) => {
      const { events } = get();
      const updatedEvents = events.map(e => 
        e.id === event.id ? event : e
      );
      set({ events: updatedEvents });
    });

    socket.on('leaderboard_update', (leaderboard) => {
      set({ leaderboard });
    });

    set({ socket });
  },

  // API calls
  loadGroups: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getGroups();
      if (response.success) {
        set({ groups: response.groups });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createGroup: async (groupData) => {
    set({ loading: true, error: null });
    try {
      console.log('Store: Creating group with data:', groupData);
      const response = await apiService.createGroup(groupData);
      console.log('Store: API response:', response);
      
      if (response.success) {
        const { groups } = get();
        set({ groups: [...groups, response.group] });
        console.log('Store: Group added to state');
        return response.group;
      } else {
        console.error('Store: API returned error:', response.error);
        set({ error: response.error });
        return null;
      }
    } catch (error) {
      console.error('Store: Exception in createGroup:', error);
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  loadEvents: async (groupId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getEvents(groupId);
      if (response.success) {
        set({ events: response.events });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  submitEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.submitEvent(eventData);
      if (response.success) {
        const { events } = get();
        set({ events: [...events, response.event] });
        return response.event;
      } else {
        set({ error: response.error });
        return null;
      }
    } catch (error) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  vetoEvent: async (eventId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.vetoEvent(eventId, userId);
      if (response.success) {
        const { events } = get();
        const updatedEvents = events.map(e => 
          e.id === eventId ? response.event : e
        );
        set({ events: updatedEvents });
        return response.event;
      } else {
        set({ error: response.error });
        return null;
      }
    } catch (error) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  loadLeaderboard: async (groupId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getLeaderboard(groupId);
      if (response.success) {
        set({ leaderboard: response.leaderboard });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Initialize app
  initializeApp: async () => {
    const { initializeSocket, loadGroups } = get();
    initializeSocket();
    await loadGroups();
  },
}));

export default useStore;
