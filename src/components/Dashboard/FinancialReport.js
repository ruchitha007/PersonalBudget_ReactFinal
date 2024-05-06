import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../../styles/FinancialReport.css';

const FinancialSummary = ({ dataManager }) => {
  const [dataList, setDataList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [capacityList, setCapacityList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: 'Bearer ' + dataManager,
        };

        const dataEndpoint = selectedOption
          ? `/budgets/getAllBudgets/${selectedOption}`
          : '/budgets/getAllBudgets';

        const capacityEndpoint = selectedOption
          ? `/budgets/capacity/${selectedOption}`
          : '/budgets/capacity';

        const capacityParams = selectedOption
          ? { params: { month: parseInt(selectedOption, 10) } }
          : {};

        const [dataResponse, capacityResponse] = await Promise.all([
          apiService.get(dataEndpoint, dataManager, { params: { month: parseInt(selectedOption, 10) } }),
          apiService.get(capacityEndpoint, dataManager, capacityParams),
        ]);

        setDataList(dataResponse.data);
        setCapacityList(capacityResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dataManager, selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="data-list-container-wrapper" style={{ marginTop: '120px', width: '80%', height: '400px', overflow: 'auto' }}>
    <div className="data-list-container">
      <h2 className="list-header">Comprehensive Data Overview</h2>

      <label>
        Select Option:
        <select className="select-dropdown" value={selectedOption} onChange={handleOptionChange}>
          <option value="">All Options</option>
          <option value="1">Option One</option>
          <option value="2">Option Two</option>
          <option value="3">Option Three</option>
          {/* Add more options as needed */}
        </select>
      </label>

      {!loading ? (
        dataList && dataList.length > 0 ? (
          <div className="data-table">
            <div className="table-row header">
              <div className="table-cell">Data Name</div>
              <div className="table-cell">Data Amount</div>
              <div className="table-cell">Total Capacity</div>
              <div className="table-cell">Remaining Balance</div>
            </div>
            {dataList.map((dataItem) => {
              const capacityForData = capacityList.find(
                (capacityItem) => capacityItem.dataName === dataItem.dataName
              );

              const dataAmount = dataItem.dataAmount || 0;
              const capacityAmount = capacityForData ? capacityForData.capacityAmount || 0 : 0;

              const remainingBalance = Math.max(0, capacityAmount - dataAmount);

              return (
                <div className="table-row" key={dataItem.id}>
                  <div className="table-cell">{dataItem.dataName}</div>
                  <div className="table-cell">{dataAmount}</div>
                  <div className="table-cell">{capacityAmount}</div>
                  <div className={`table-cell remaining-balance`}>{remainingBalance}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-data-message">No data available.</p>
        )
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
    </div>
  );
};

export default FinancialSummary;
