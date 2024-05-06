import axios from 'axios';
import authService from '../authService';
import config from '../../config';

jest.mock('axios');

const API_URL = config.apiUrl+'/api';

describe('authService', () => {
  describe('signup method', () => {
    it('should handle errors during signup', async () => {
      const username = 'testuser';
      const password = 'password123';
      const fullName = 'John Doe';
      const mockError = new Error('Error registering user');
      axios.post.mockRejectedValue(mockError);

      try {
        await authService.signup(username, password, fullName);
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });
  });

  describe('login method', () => {
    it('should successfully log in a user and return the access token', async () => {
      const username = 'testuser';
      const password = 'password123';
      const expectedResponse = {
        data: {
          token: 'dummyToken',
          refreshToken: 'refreshToken',
        },
      };

      axios.post.mockResolvedValue(expectedResponse);

      const token = await authService.login(username, password);

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        username,
        password,
      });

      expect(localStorage.getItem('token')).toEqual(expectedResponse.data.token);
      expect(localStorage.getItem('refreshToken')).toEqual(expectedResponse.data.refreshToken);
      expect(token).toEqual(expectedResponse.data.token);
    });

    it('should handle errors during login', async () => {
      const username = 'testuser';
      const password = 'password123';

      const mockError = new Error('Error logging in');
      axios.post.mockRejectedValue(mockError);

      try {
        await authService.login(username, password);
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });
  });

  describe('refreshAccessToken method', () => {
    it('should handle errors during token refresh', async () => {
      const refreshToken = 'dummyRefreshToken';

      const mockError = new Error('Error refreshing access token');
      axios.get.mockRejectedValue(mockError);

      try {
        await authService.refreshAccessToken(refreshToken);
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });
  });

  describe('checkTokenExpiration method', () => {
    it('should correctly check if the token is expired', () => {
      const expirationTime = Math.floor(Date.now() / 1000) - 50; 

      const isTokenExpired = authService.checkTokenExpiration(expirationTime);

      expect(isTokenExpired).toBeTruthy();
    });
  });
});
