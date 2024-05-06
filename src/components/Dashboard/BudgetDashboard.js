import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AddData from './AddBudget';
import DataList from './FinancialReport';
import DataChart from './BudgetChart';
import AddCapacity from './BudgetLimit';
import { useUserAuth } from '../Auth/AccessState'; 
import '../../styles/BudgetDashboard.css'; 
import config from '../../config';

const BASE_URL = config.apiUrl;

const PersonalDashboard = ({ dataManager, userData }) => {
  const {
    logout,
    checkUserTokenExpiration,
    
  } = useUserAuth();

  const [showAddData, setShowAddData] = useState(false);
  const [showDataList, setShowDataList] = useState(false);
  const [showDataChart, setShowDataChart] = useState(false);
  const [showAddCapacity, setShowAddCapacity] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isTokenRefreshed, setIsTokenRefreshed] = useState(false);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmationYes = async () => {
    
    setIsTokenRefreshed(true);
    setShowConfirmationModal(false);
    try {
      console.log('Refreshing token...');
      console.log('Token refreshed successfully...');
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };
  const handleConfirmationNo = () => {
    
    setShowConfirmationModal(false);
    window.location.reload();
  };

  const handleAddDataClick = () => {
    setShowAddData(true);
    setShowDataList(false);
    setShowDataChart(false);
    setShowAddCapacity(false);
  };

  const handleDataListClick = () => {
    setShowAddData(false);
    setShowDataList(true);
    setShowDataChart(false);
    setShowAddCapacity(false);
  };

  const handleDataChartClick = () => {
    setShowAddData(false);
    setShowDataList(false);
    setShowDataChart(true);
    setShowAddCapacity(false);
  };

  const handleAddCapacityClick = () => {
    setShowAddData(false);
    setShowDataList(false);
    setShowDataChart(false);
    setShowAddCapacity(true);
  };

  const handleLogout = () => {
    window.location.reload();
    logout();
  };

  const handleAddCapacity = async (data) => {
   
    try {
      const apiUrl = BASE_URL + '/api/budgets/capacity';
      data.username = userData;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${dataManager}`, 
        },
        body: JSON.stringify(data),
      });

      let responseData;

      if (response.ok) {
        responseData = await response.json();
        return { success: true, message: 'Capacity added successfully', responseData };
      } else {
        console.error('Failed to add capacity:', response.statusText);

        const errorData = await response.json();
        console.error('Error Data:', errorData);

        throw new Error('Failed to add capacity');
      }
    } catch (error) {
      console.error('Error adding capacity:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true; 
  
    console.log('Setting up token refresh interval...');
    const tokenRefreshInterval = setInterval(async () => {
      if (!isTokenRefreshed && isMounted) {
        console.log('Token about to expire. Displaying confirmation modal...');
        setShowConfirmationModal(true);
        setTimeout(async () => {
          if (!isTokenRefreshed && isMounted) {
            setShowConfirmationModal(false);
            try {
              console.log('Refreshing token...');
              if (isMounted) {
                setIsTokenRefreshed(true); 
                console.log('Token refreshed successfully.');
                window.location.reload();
              }
            } catch (error) {
              console.error('Error refreshing token:', error);
              logout();
              window.location.reload();
            }
          } else {
            setShowConfirmationModal(false);
          }
        },20000);
      }
    }, 40000);
    return () => {
      console.log('Clearing token refresh interval...');
      clearInterval(tokenRefreshInterval);
      isMounted = false; 
    };
  }, [isTokenRefreshed, logout, checkUserTokenExpiration]);

  return (
    <div>
      <h1 className="personaldata">Explore Your Data</h1>
      <p className="personaldata">Simplify your data management with our platform</p>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <nav className="dashboard">
  <ul>
    <li>
      <button onClick={handleDataListClick}>Data Records</button>
    </li>
    <li>
      <button onClick={handleDataChartClick}>Data Analysis Chart</button>
    </li>
    <li>
      <button onClick={handleAddDataClick}>New Data Entry</button>
    </li>
    <li>
      <button onClick={handleAddCapacityClick}>Data Customization</button>
    </li>
  </ul>
</nav>


      {showAddData && (
        <div className="centered-component add-data-component">
          <AddData dataManager={dataManager} /> 
        </div>
      )}
      {showDataList && (
        <div className="centered-component data-list-component">
          <DataList dataManager={dataManager} /> 
        </div>
      )}
      {showDataChart && (
        <div className="centered-component data-chart-component">
          <DataChart dataManager={dataManager} /> 
        </div>
      )}
      {showAddCapacity && (
        <div className="centered-component add-capacity-component">
          <AddCapacity dataManager={dataManager} onAddCapacity={handleAddCapacity} userData={userData} /> 
        </div>
      )}

   
      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={handleCloseConfirmationModal}
        contentLabel="Token Refresh Confirmation Modal"
        className="dashboard-modal" 
      >
        <h2>Timeout Warning</h2>
        <p>Still extend your session to keep working?</p>
        <button onClick={handleConfirmationYes}>Yes</button>
        <button onClick={handleConfirmationNo}>No</button>
      </Modal>
    </div>
  );
};

export default PersonalDashboard;
