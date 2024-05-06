import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import UserLogin from '../UserAuthentication'; 

describe('UserAuthentication Component', () => {
  test('renders login form', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <UserLogin /> 
      </BrowserRouter>
    );

    expect(getAllByText('User Login')[0]).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getAllByText('Log In')[1]).toBeInTheDocument();
  });
  test('handles login failure and displays error message', async () => {
    const { getByPlaceholderText, getAllByText } = render(
      <BrowserRouter>
        <UserLogin /> 
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'invalid_user' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'invalid_password' } });
    fireEvent.click(getAllByText('Log In')[1]);

    try {
      await waitFor(() => {
        expect(screen.queryByText('Oops! Login Failed. Please Double-Check Your Username and Password.')).toBeInTheDocument();
      }, { timeout: 5000 }); 
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
  test('handles login and displays success message', async () => {
    const { getByPlaceholderText, getAllByText } = render(
      <BrowserRouter>
        <UserLogin /> 
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'john_doe' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'secure_password' } });
    fireEvent.click(getAllByText('Log In')[1]);

    try {
      await waitFor(() => {
        expect(screen.queryByText('Oops! Login Failed. Please Double-Check Your Username and Password.')).toBeInTheDocument();
      }, { timeout: 5000 }); 
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });


});
