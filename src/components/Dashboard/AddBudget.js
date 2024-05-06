//SetBudget.js
import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/AddBudget.css'; 
import config from '../../config';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

const SetBudget = ({ dataManager }) => {
  const [dataCategory, setDataCategory] = useState('');
  const [dataAmount, setDataAmount] = useState('');
  const [selectedData, setSelectedData] = useState(new Date());

  const handleAddData = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/budgets`,
        { budgetName: dataCategory, budgetNumber: dataAmount, selectedDate: selectedData },
        { headers: { Authorization: `Bearer ${dataManager}` } }
      );

      Alert.success('Data added successfully', {
        position: 'top-right',
        effect: 'slide',
        timeout: 3000,
      });

      setDataCategory('');
      setDataAmount('');
      setSelectedData(new Date());
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      Alert.error(`Error: ${errorMessage}`, {
        position: 'top-right',
        effect: 'slide',
        timeout: 3500,
      });
    }
  };

  return (
    <div className="create-data-container">
      <h2>Add a New Data Entry</h2>
      <div className="input-group">
        <label>Date:</label>
        <DatePicker selected={selectedData} onChange={(date) => setSelectedData(date)} />
      </div>
      <div className="input-group">
        <label>Category:</label>
        <input type="text" value={dataCategory} onChange={(e) => setDataCategory(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Amount:</label>
        <input
          type="number"
          value={dataAmount}
          onChange={(e) => setDataAmount(e.target.value)}
        />
      </div>
      <button className="create-button" onClick={handleAddData}>
        Add Data
      </button>
      <Alert stack={{ limit: 3 }} />
    </div>
  );
};

export default SetBudget;
