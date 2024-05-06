import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseCapacityForm from '../ExpenseCapacity';

describe('ExpenseCapacity component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock between tests
  });

  it('should render successfully', () => {
    render(<ExpenseCapacityForm />);

    expect(screen.getByText('Add Budget Capacity')).toBeInTheDocument();
    expect(screen.getByRole('select')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Category limit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Budget Capacity' })).toBeInTheDocument();
    expect(screen.getByText('Capacity Data')).toBeInTheDocument();
  });


  it('should send a request to the server to add the budget capacity', async () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        message: 'Budget capacity added successfully',
      }),
    });

    render(<ExpenseCapacityForm />);

    userEvent.type(screen.getByLabelText('Expense Type:'), 'Travel');
    userEvent.type(screen.getByLabelText('Expense Value:'), '200');

    screen.getByRole('button', { name: 'Add Expense Type' }).click();

    await screen.findByText('Budget added successfully'); // Wait for success message

    expect(mockFetch).toHaveBeenCalledWith('/budgets/capacity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryName: 'Travel',
        categoryLimit: '200',
        selectedMonth: 1,
      }),
    });
  });
  it('should fetch capacity data for the selected month', async () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        data: [
          { categoryName: 'Food', categoryLimit: 100 },
          { categoryName: 'Entertainment', categoryLimit: 50 },
        ],
      }),
    });

    render(<ExpenseCapacityForm />);

    userEvent.selectOptions(screen.getByLabelText('Select Month:'), '1');

    await screen.findByText('Food'); // Wait for data to load

    expect(mockFetch).toHaveBeenCalledWith('/budgets/capacity/1');

    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });
  it('should display an error message if the budget capacity was not added successfully', async () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        success: false,
        message: 'Failed to add budget capacity',
      }),
    });

    render(<ExpenseCapacityForm />);

    userEvent.type(screen.getByLabelText('Expense Type:'), 'Travel');
    userEvent.type(screen.getByLabelText('Expense Value:'), '200');

    screen.getByRole('button', { name: 'Add Expense Type' }).click();

    expect(await screen.findByText('Failed to add budget capacity')).toBeInTheDocument();
  });

  it('should display a success message if the budget capacity was added successfully', async () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        message: 'Budget capacity added successfully',
      }),
    });

    render(<ExpenseCapacityForm />);

    userEvent.type(screen.getByLabelText('Expense Type:'), 'Travel');
    userEvent.type(screen.getByLabelText('Expense Value:'), '200');

    screen.getByRole('button', { name: 'Add Expense Type' }).click();

    expect(await screen.findByText('Budget added successfully')).toBeInTheDocument();
  });
});
