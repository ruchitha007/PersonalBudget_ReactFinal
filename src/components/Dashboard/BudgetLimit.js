//ExpenseCapacity.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import apiService from '../services/apiService';
import '../../styles/BudgetLimit.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Alert from 'react-s-alert';

const ExpenseCapacity = ({ onAddNewNameCapacity, newUserName, newUserToken }) => {
  const [newExpenseType, setNewExpenseType] = useState('');
  const [newExpenseValue, setNewExpenseValue] = useState('');
  const [selectedNewMonth, setSelectedNewMonth] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [addNewNameMessage, setAddNewNameMessage] = useState('');
  const [newCapacityData, setNewCapacityData] = useState([]);

  const handleAddNewNameCapacity = async () => {
    try {
      if (typeof onAddNewNameCapacity !== 'function') {
        console.error('onAddNewNameCapacity is not a function');
        return;
      }

      const data = { newExpenseType, newExpenseValue, selectedNewMonth: parseInt(selectedNewMonth, 10) };
      const response = await onAddNewNameCapacity(data);

      if (response && response.success) {
        setAddNewNameMessage(response.message);
        alert.success(response.message, {
          position: 'top-right',
          effect: 'slide',
          timeout: 3000,
        });
        setNewExpenseType('');
        setNewExpenseValue('');
        setSelectedNewMonth('');
      } else {
        console.error('Failed to add new name capacity:', response ? response.message : 'Unknown error');
        setAddNewNameMessage(response ? response.message : 'Failed to add new name capacity');
        Alert.error(response ? response.message : 'Failed to add new name capacity', {
          position: 'top-right',
          effect: 'slide',
          timeout: 3500,
        });
      }
    } catch (error) {
      console.error('Error adding new name capacity:', error.message);
      setAddNewNameMessage('Error adding new name capacity');
      Alert.error('Error adding new name capacity', {
        position: 'top-right',
        effect: 'slide',
        timeout: 3500,
      });
    }
  };

  const openNewModal = () => {
    setIsNewModalOpen(true);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
  };

  const newCapacityEndpoint = selectedNewMonth
    ? `/budgets/capacity/${selectedNewMonth}`
    : '/budgets/capacity';

  useEffect(() => {
    const fetchNewCapacityData = async () => {
      try {
        const response = await apiService.get(newCapacityEndpoint, newUserToken);
        setNewCapacityData(response.data || []);
      } catch (error) {
        console.error('Error fetching new capacity data:', error);
      }
    };

    fetchNewCapacityData();
  }, [newCapacityEndpoint, newUserToken]);

  return (
    <div className="new-name-container">
      <div className="add-new-name-box">
        <h3 className="header">Register New Name</h3>
        <div className="form-group">
          <label htmlFor="selectedNewMonth">Select New Month:</label>
          <select
            id="selectedNewMonth"
            className="select-dropdown"
            value={selectedNewMonth}
            onChange={(e) => setSelectedNewMonth(e.target.value)}
          >
            <option value="">Select New Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="newExpenseType">New Expense Type:</label>
          <input
            id="newExpenseType"
            className="input-field"
            type="text"
            value={newExpenseType}
            onChange={(e) => setNewExpenseType(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newExpenseValue">New Expense Value:</label>
          <input
            id="newExpenseValue"
            className="input-field"
            type="text"
            value={newExpenseValue}
            onChange={(e) => setNewExpenseValue(e.target.value)}
          />
        </div>
        <button className="add-new-name-button" onClick={handleAddNewNameCapacity}>
          Add New Name Type
        </button>
      </div>

      <div className="new-capacity-data-box">
        <h3 className="header">New Name Data</h3>
        {newCapacityData.length > 0 ? (
          <table className="new-capacity-table">
            <thead>
              <tr>
                <th>New Expense Type:</th>
                <th>New Expense Value:</th>
              </tr>
            </thead>
            <tbody>
              {newCapacityData.map((item) => (
                <tr key={item.budgetname}>
                  <td>{item.budgetname}</td>
                  <td>{item.budgetnumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No capacity added.</p>
        )}
      </div>

      <Modal
        isOpen={isNewModalOpen}
        onRequestClose={closeNewModal}
        contentLabel="Add New Name Message"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{addNewNameMessage}</h2>
        <button onClick={closeNewModal}>Close</button>
      </Modal>

      <Alert stack={{ limit: 3 }} />
    </div>
  );
};

export default ExpenseCapacity;
