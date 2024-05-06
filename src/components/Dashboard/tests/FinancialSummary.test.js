import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FinancialSummary from '../FinancialSummary';
import financialApiService from '../../services/financialApiService';

jest.mock('../../services/financialApiService');

describe('FinancialSummary component', () => {
  it('should render the no data message when no budgets are available', async () => {
    financialApiService.get.mockResolvedValue({
      data: [],
    });

    render(<FinancialSummary token="dummyToken" />);

    await waitFor(() => {
      expect(screen.getByText('No budget data available.')).toBeInTheDocument();
    });
  });
  it('render the loading message when fetching data', () => {
    render(<FinancialSummary token="dummyToken" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('should update the budget table when the selected month changes', async () => {
    financialApiService.get.mockImplementation((endpoint) => {
      if (endpoint.includes('/budgets/getAllBudgets/2')) {
        return Promise.resolve({
          data: [
            { id: 1, categoryName: 'Groceries', categoryLimit: 150 },
            { id: 2, categoryName: 'Rent', categoryLimit: 600 },
            { id: 3, categoryName: 'Utilities', categoryLimit: 200 },
          ],
        });
      } else {
        return Promise.resolve({
          data: [
            { id: 1, categoryName: 'Groceries', categoryLimit: 100 },
            { id: 2, categoryName: 'Rent', categoryLimit: 500 },
            { id: 3, categoryName: 'Utilities', categoryLimit: 150 },
          ],
        });
      }
    });

    render(<FinancialSummary token="dummyToken" />);

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.getByText('Utilities')).toBeInTheDocument();
    });

    const selectElement = screen.getByRole('combobox');
    selectElement.value = '2';

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.getByText('Utilities')).toBeInTheDocument();
    });
  });
  it('should render the budget table when budgets are available', async () => {
    const budgets = [
      { id: 1, categoryName: 'Groceries', categoryLimit: 100 },
      { id: 2, categoryName: 'Rent', categoryLimit: 500 },
      { id: 3, categoryName: 'Utilities', categoryLimit: 150 },
    ];

    const capacityData = [
      { categoryName: 'Groceries', categoryLimit: 200 },
      { categoryName: 'Rent', categoryLimit: 700 },
      { categoryName: 'Utilities', categoryLimit: 175 },
    ];

    financialApiService.get.mockResolvedValue({
      data: budgets,
    });

    render(<FinancialSummary token="dummyToken" />);

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.getByText('Utilities')).toBeInTheDocument();
      expect(screen.getByText('Remaining Balance')).toBeInTheDocument();
    });
  });

});
