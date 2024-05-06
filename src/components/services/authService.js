import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const authService = {
  userRegistration: async (fullName, username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        fullName,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  },
  checkUserTokenExpiry: () => {
    const expirationTime = Math.floor(Date.now() / 1000) + 50;
    const currentTime = Date.now() / 1000;

    return currentTime < expirationTime;
  },

  refreshAccessToken: async () => {
    try {
      let refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        const response = await axios.get(`${API_BASE_URL}/api/auth/refreshAccessToken`);
        refreshToken = response.data.refreshToken;

        localStorage.setItem('refreshToken', refreshToken);
      }
      const response = await axios.get(`${API_BASE_URL}/api/auth/refreshAccessToken`, {
        refreshToken,
      });
      const newToken = response.data.accessToken;
      localStorage.setItem('token', newToken);

      return newToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  },

  userLogin: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });

      const { token, refreshToken } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      return token;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  makeAuthenticatedRequest: async (url, options = {}) => {
    try {
      let token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token available');
      }

      const isTokenExpired = authService.checkUserTokenExpiry(token);

      if (isTokenExpired) {
        token = await authService.refreshAccessToken();
        if (!token) {
          throw new Error('Failed to refresh token');
        }
      }

      const response = await axios(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Authenticated request error:', error);
      throw error;
    }
  },
};

export default authService;
