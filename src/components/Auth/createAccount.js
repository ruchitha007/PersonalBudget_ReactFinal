import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import '../../styles/createAccount.css';

const AccountCreation = () => {
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [signupStatus, setSignupStatus] = useState(null);
  
  useEffect(() => {
    const closeDialog = () => {
      setTimeout(() => setSignupStatus(null), 2000);
    };

    if (signupStatus === 'success' || signupStatus === 'failed') {
      closeDialog();
    }
  }, [signupStatus]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await authService.registerUser(displayName, userName, passWord);
      setSignupStatus('success');
    } catch (error) {
      console.error('Signup failed', error);
      setSignupStatus('failed');
    }
  };

 
  return (
    <div className="signup-container">
      <h2 className="signup-heading">Customer Registration</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="signup-input-container">
          <label className="signup-label">Display Name:</label>
          <input
            className="signup-input"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="signup-input-container">
          <label className="signup-label">User ID:</label>
          <input
            className="signup-input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="signup-input-container">
          <label className="signup-label">Secure Password:</label>
          <input
            className="signup-input"
            type="password"
            value={passWord}
            onChange={(e) => setPassWord(e.target.value)}
          />
        </div>
        <button className="signup-button" type="submit">
          Register
        </button>

        {signupStatus === 'success' && (
          <div className="dialog success">
            Signup successful!
          </div>
        )}
        {signupStatus === 'failed' && (
          <div className="dialog error">Sorry, Signup Failed. Please Give It Another Try</div>
        )}
      </form>
    </div>
  );
};

export default AccountCreation;
