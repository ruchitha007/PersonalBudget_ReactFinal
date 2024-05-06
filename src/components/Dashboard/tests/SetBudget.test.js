import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetBudget from '../SetBudget';
import axios from 'axios';

jest.mock('axios');

describe('SetBudget component', () => {
  it('should render the form with input fields and a submit button', () => {
    render(<SetBudget token="dummyToken" />);

    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Budget' })).toBeInTheDocument();
  });


  it('should submit the form data and display a success notification on successful submission', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Budget added successfully' } });

    render(<SetBudget token="dummyToken" />);

    const categoryNameInput = screen.getByLabelText('Category:');
    const amountInput = screen.getByLabelText('Amount:');
    const submitButton = screen.getByRole('button', { name: 'Add Budget' });

    userEvent.type(categoryNameInput, 'Groceries');
    userEvent.type(amountInput, '100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Budget added successfully')).toBeInTheDocument();
    });
  });
  it('should display error notifications when input fields are empty', async () => {
    render(<SetBudget token="dummyToken" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Budget' }));

    await waitFor(() => {
      expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
    });
  });
  it('should display an error notification when the API request fails', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Error adding budget' } } });

    render(<SetBudget token="dummyToken" />);

    const categoryNameInput = screen.getByLabelText('Category:');
    const amountInput = screen.getByLabelText('Amount:');
    const submitButton = screen.getByRole('button', { name: 'Add Budget' });

    userEvent.type(categoryNameInput, 'Groceries');
    userEvent.type(amountInput, '100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Error adding budget')).toBeInTheDocument();
    });
  });
});
