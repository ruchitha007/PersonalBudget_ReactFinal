import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { UserAuthProvider, useUserAuth } from './AuthenticationState';
import authService from '../services/authService';

jest.mock('../services/authService', () => ({
  refreshUserAccessToken: jest.fn(),
}));

function renderWithProvider(ui) {
  return renderHook(() => useUserAuth(), { wrapper: UserAuthProvider });
}

describe('AuthenticationState component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides initial context values', () => {
    const { result: authResult } = renderWithProvider();

    expect(authResult.current.isLoggedIn).toBe(false);
    expect(authResult.current.accessToken).toBe(null);
  });

  test('logs in and out a user', () => {
    const { result: authResult } = renderWithProvider();

    act(() => {
      authResult.current.loginUser('mockedToken');
    });

    expect(authResult.current.isLoggedIn).toBe(true);
    expect(authResult.current.accessToken).toBe('mockedToken');

    act(() => {
      authResult.current.logoutUser();
    });

    expect(authResult.current.isLoggedIn).toBe(false);
    expect(authResult.current.accessToken).toBe(null);
  });

  test('refreshes user access token', async () => {
    const { result: authResult } = renderWithProvider();

    authService.refreshUserAccessToken.mockResolvedValue('newToken');

    await act(async () => {
      await authResult.current.refreshAccessToken();
    });
    expect(authResult.current.accessToken).toBe('newToken');
  });
});
