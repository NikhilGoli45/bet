import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

WebBrowser.maybeCompleteAuthSession();

export const authService = {
  async loginWithGoogle() {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      const authUrl = `${API_BASE_URL}/auth/google`;
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        
        if (token) {
          return token;
        } else {
          throw new Error('No token received');
        }
      } else {
        throw new Error('Authentication cancelled or failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify`, {
        token
      });
      return response.data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
};
