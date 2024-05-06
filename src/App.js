import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { UserAuthProvider } from './components/Auth/AccessState';
import UserLogin from './components/Auth/UserAccessAuth';
import UserRegistration from './components/Auth/createAccount';
import UserDashboard from './components/Dashboard/BudgetDashboard';
import BudgetOverview from './components/Dashboard/FinancialReport';
import FinancialChart from './components/Dashboard/BudgetChart';
import AddBudgetCapacity from './components/Dashboard/BudgetLimit';
import CreateBudget from './components/Dashboard/AddBudget';
import authService from './components/services/authService';
import './styles/style.css';
import Footer from './components/Footer/Footer';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + './bg.png'}
          alt="Budget Website Banner"
          className="background-image"
          width="1000"
          height="700"
        />
        <div className="text-overlay">
          <h1 className="welcome-message">Welcome to Personal Budget App</h1>
          <h2 className="sub-heading">Take Control of Your Finances, Secure Your Future!</h2>
          <ul className="dashboard-features">
            <li>Plan and oversee your budget allocations</li>
            <li>Customize your budget preferences</li>
            <li>Review detailed financial data and trends</li>
            <li>Access a centralized overview of all your budgets</li>
          </ul>
          <div className="button-container">
            <Link to="/login" className="blue-button">Log In</Link>
            <span className="button-separator">or</span>
            <Link to="/signup" className="blue-button">Sign Up Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [token, setUserToken] = useState(null);
  const [isTokenRefreshModalOpen, setIsTokenRefreshModalOpen] = useState(false);

  const handleUserLogin = (token) => {
    setUserToken(token);
    setIsUserLoggedIn(true);
  };

  useEffect(() => {
    const checkUserTokenExpiry = async () => {
      if (authService.checkUserTokenExpiry()) {
        setIsTokenRefreshModalOpen(true);
      }
    };

    checkUserTokenExpiry();
  }, []);

  return (
    <Router>
      <UserAuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin onUserLogin={handleUserLogin} />} />
          <Route path="/signup" element={<UserRegistration />} />
          <Route path="/dashboard" element={isUserLoggedIn ? <UserDashboard token={token} /> : <Navigate to="/login" />} />
          {isUserLoggedIn && (
            <>
              <Route path="/dashboard/budget-list" element={<BudgetOverview />} />
              <Route path="/dashboard/budget-chart" element={<FinancialChart />} />
              <Route path="/dashboard/configure-budget" element={<AddBudgetCapacity />} />
              <Route path="/dashboard/add-budget" element={<CreateBudget token={token} />} />
            </>
          )}
        </Routes>
      </UserAuthProvider>
      <Footer />
    </Router>
  );
};

export default App;
