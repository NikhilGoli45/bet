import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const apiService = {
  // Groups
  getGroups: async () => {
    try {
      const response = await api.get('/groups');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch groups');
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await api.post('/groups/create', groupData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create group');
    }
  },

  getGroup: async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch group');
    }
  },

  addMembersToGroup: async (groupId, members) => {
    try {
      const response = await api.post(`/groups/${groupId}/members`, { members });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add members');
    }
  },

  // Events
  getEvents: async (groupId) => {
    try {
      const response = await api.get(`/events/group/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch events');
    }
  },

  getRecentEvents: async (groupId) => {
    try {
      const response = await api.get(`/events/recent/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch recent events');
    }
  },

  submitEvent: async (eventData) => {
    try {
      const response = await api.post('/events/submit', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit event');
    }
  },

  vetoEvent: async (eventId, userId) => {
    try {
      const response = await api.post('/events/veto', { eventId, userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to veto event');
    }
  },

  // Leaderboard
  getLeaderboard: async (groupId) => {
    try {
      const response = await api.get(`/leaderboard/${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch leaderboard');
    }
  },
};

export default apiService;
