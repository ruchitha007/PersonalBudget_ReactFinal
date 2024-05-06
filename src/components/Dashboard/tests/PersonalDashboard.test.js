import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalDashboard from '../PersonalDashboard';

jest.mock('../../Auth/AuthContext', () => ({
  useAuth: () => ({
    logout: jest.fn(),
    refreshAccessToken: jest.fn(),
    checkTokenExpiration: jest.fn(),
  }),
}));

jest.mock('../../AddBudgetCapacity', () => ({
  __esModule: true,
  default: () => <div data-testid="addBudgetCapacityComponent">Add Budget Capacity Component</div>,
}));

jest.mock('../AddBudget', () => ({
  __esModule: true,
  default: () => <div data-testid="AddBudget">Add Budget Component</div>,
}));

jest.mock('../BudgetList', () => ({
  __esModule: true,
  default: () => <div data-testid="BudgetList">Budget List Component</div>,
}));

jest.mock('../BudgetChart', () => ({
  __esModule: true,
  default: () => <div data-testid="BudgetChart">Budget Chart Component</div>,
}));

describe('PersonalDashboard component', () => {
  it('should display the logout button', () => {
    render(<PersonalDashboard />);
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should display the AddBudget component when the "Add Budget" button is clicked', () => {
    render(<PersonalDashboard />);
    const addBudgetButton = screen.getByRole('button', { name: 'Add Budget' });
    fireEvent.click(addBudgetButton);

    const addBudgetComponent = screen.getByTestId('AddBudget');
    expect(addBudgetComponent).toBeInTheDocument();
  });

  it('should display the BudgetList component when the "Budget List" button is clicked', () => {
    render(<PersonalDashboard />);
    const budgetListButton = screen.getByRole('button', { name: 'Budget List' });
    fireEvent.click(budgetListButton);

    const budgetListComponent = screen.getByTestId('BudgetList');
    expect(budgetListComponent).toBeInTheDocument();
  });

  it('should display the navigation bar with buttons for budget list, budget chart, add budget, and add budget capacity', () => {
    render(<PersonalDashboard />);
    const navigationBar = screen.getByRole('navigation');
    expect(navigationBar).toBeInTheDocument();

    const budgetListButton = screen.getByRole('button', { name: 'Budget List' });
    expect(budgetListButton).toBeInTheDocument();

    const budgetChartButton = screen.getByRole('button', { name: 'Budget Chart' });
    expect(budgetChartButton).toBeInTheDocument();

    const addBudgetButton = screen.getByRole('button', { name: 'Add Budget' });
    expect(addBudgetButton).toBeInTheDocument();

    const addBudgetCapacityButton = screen.getByRole('button', { name: 'Add Budget Capacity' });
    expect(addBudgetCapacityButton).toBeInTheDocument();
  });

  it('should display the BudgetChart component when the "Budget Chart" button is clicked', () => {
    render(<PersonalDashboard />);
    const budgetChartButton = screen.getByRole('button', { name: 'Budget Chart' });
    fireEvent.click(budgetChartButton);

    const budgetChartComponent = screen.getByTestId('BudgetChart');
    expect(budgetChartComponent).toBeInTheDocument();
  });

  it('"Add Budget Capacity" button is clicked', () => {
    render(<PersonalDashboard />);
    const addBudgetCapacityButton = screen.getByRole('button', { name: 'Add Budget Capacity' });
    fireEvent.click(addBudgetCapacityButton);

    const addBudgetCapacityComponent = screen.getByTestId('addBudgetCapacityComponent');
    expect(addBudgetCapacityComponent).toBeInTheDocument();
  });
});
