import React, { useState } from 'react';
import authenticationService from '../services/authService';
import '../../styles/UserAccessAuth.css';
import { useNavigate } from 'react-router-dom';

const UserAuthentication = ({ onUserLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const token = await authenticationService.loginUser(username, password);
      onUserLogin(token, username);
      navigate('/dashboard');
    } catch (error) {
      console.error('User login failed', error);
      setStatusMessage('Oops! Login Failed. Please Double-Check Your Username and Password.');
      openModal();
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-heading">User Login</h2>
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
      </div>
      <div className={`login-modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-content">
          <h2>{statusMessage}</h2>
          <button className="modal-button" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuthentication;
