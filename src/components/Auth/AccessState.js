import React, { createContext, useContext, useState, useEffect } from 'react';
import authUtilities from '../services/authService';

const UserAuthContext = createContext();
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [authToken, setAuthToken] = useState(null);

 

  const loginUser = (token) => {
    setAuthToken(token);
    setLoggedInUser(true);
    localStorage.setItem('authToken', token);
  };
  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    console.log('Stored Auth Token:', storedAuthToken);

    if (storedAuthToken) {
      setAuthToken(storedAuthToken);
      setLoggedInUser(true);
    }
  }, []);
  const refreshUserToken = async () => {
    try {
      const newAuthToken = await authUtilities.refreshUserToken();
      setAuthToken(newAuthToken);
      localStorage.setItem('authToken', newAuthToken);
      return newAuthToken;
    } catch (error) {
      console.error('Error refreshing user token:', error);
      logoutUser();
    }
  };

  const checkTokenExpiration = () => {
    const expirationTime = Math.floor(Date.now() / 1000) + 60;
    const currentTime = Date.now() / 1000;

    return currentTime < expirationTime;
  };
  const logoutUser = () => {
    setAuthToken(null);
    setLoggedInUser(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userJwt');
    localStorage.removeItem('userRefreshToken');
    window.location.reload();
  };

 

  const setAccessToken = (newToken) => {
    setAuthToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  return (
    <UserAuthContext.Provider
      value={{
        loggedInUser,
        authToken,
        loginUser,
        logoutUser,
        refreshUserToken,
        checkTokenExpiration,
        setAccessToken,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

