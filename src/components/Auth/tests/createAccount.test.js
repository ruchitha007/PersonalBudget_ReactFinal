import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserRegistration from './AccountCreation';
import { userRegistration } from '../services/authService';

jest.mock('../services/authService');

describe('AccountCreation component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('handles signup failure and displays error message', async () => {
    userRegistration.mockRejectedValue(new Error('Registration failed'));

    render(<UserRegistration />);
    userEvent.type(screen.getByLabelText('Full Name:'), 'Test123');
    userEvent.type(screen.getByLabelText('Username:'), 'Test1');
    userEvent.type(screen.getByLabelText('Password:'), 'invalidpassword');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Signup Failed. Incorrect username or password')).toBeInTheDocument();
    });
  });
  test('renders signup form', () => {
    render(<UserRegistration />);
    const headingElement = screen.getByRole('heading', { name: 'Customer Registration' });
    const fullNameInputElement = screen.getByLabelText('Full Name:');
    const usernameInputElement = screen.getByLabelText('Username:');
    const passwordInputElement = screen.getByLabelText('Password:');
    const registerButtonElement = screen.getByRole('button', { name: 'Register' });

    expect(headingElement).toBeInTheDocument();
    expect(fullNameInputElement).toBeInTheDocument();
    expect(usernameInputElement).toBeInTheDocument();
    expect(passwordInputElement).toBeInTheDocument();
    expect(registerButtonElement).toBeInTheDocument();
  });

  test('handles signup and displays success message', async () => {
    userRegistration.mockResolvedValue('Success');

    render(<UserRegistration />);
    userEvent.type(screen.getByLabelText('Full Name:'), 'Test123');
    userEvent.type(screen.getByLabelText('Username:'), 'Test1');
    userEvent.type(screen.getByLabelText('Password:'), 'abcd12345');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Signup successful!')).toBeInTheDocument();
    });
  });
});
