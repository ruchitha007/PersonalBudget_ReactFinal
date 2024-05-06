//EconomicChart.js
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import apiService from '../services/apiService';
import '../../styles/BudgetChart.css';

const EconomicChart = ({ authToken }) => {
  const barChartCanvasRef = useRef(null);
  const pieChartCanvasRef = useRef(null);
  const lineChartCanvasRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState([]);
  const [budgetCapacity, setBudgetCapacity] = useState([]);

  useEffect(() => {
    const fetchDataAndCreateCharts = async () => {
      try {
        const budgetEndpoint = selectedMonth
          ? `/budgets/getAllBudgets/${selectedMonth}`
          : '/budgets/getAllBudgets';

        const capacityEndpoint = selectedMonth
          ? `/budgets/capacity/${selectedMonth}`
          : '/budgets/capacity';

        const [budgetResponse, capacityResponse] = await Promise.all([
          apiService.get(budgetEndpoint, authToken, {
            params: { month: parseInt(selectedMonth, 10) },
          }),
          apiService.get(capacityEndpoint, authToken),
        ]);

        const budgetData = budgetResponse.data || [];
        const capacityData = capacityResponse.data || [];

        setBudgetData(budgetData);
        setBudgetCapacity(capacityData);
        setLoading(false);

        createBarChart();
        createPieChart();
        createLineChart();
        
      } catch (error) {
        console.error('Error fetching budget data: ', error);
        setLoading(false);
      }
    };

    fetchDataAndCreateCharts();
  }, [authToken, selectedMonth]);

  useEffect(() => {
    if (!loading) {
      createBarChart();
      createPieChart();
      createLineChart();
    }
  }, [loading, budgetData, budgetCapacity]);

  const createPieChart = () => {
    const pieCanvas = pieChartCanvasRef.current;

    if (!pieCanvas) {
      console.error('Pie Canvas element not found');
      return;
    }

    const pieCtx = pieCanvas.getContext('2d');
    if (!pieCtx) {
      console.error('Unable to get 2D context for pie canvas');
      return;
    }

    try {
      if (pieCanvas.chart) {
        pieCanvas.chart.destroy();
      }

      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetName: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      const pieData = combinedData.map((item, index) => {
        const actualExpenditure = item.actualExpenditure || 0;
        const budgetCapacity = item.budgetCapacity || 0;
        const remainingBudget = budgetCapacity - actualExpenditure;

        const backgroundColors = [
          '#FF5733', '#33FF7E', '#33A2FF', '#FF33A2', '#7E33FF', '#FF7E33', '#33FFA2', '#A2FF33', '#FF3333', '#33FF33',
          '#FFA233', '#FF33F5', '#7E7E7E', '#3333FF', '#7E33A2', '#7E33FF', '#33A2A2', '#33FF33', '#FFA27E', '#33A233',
        ];
        

        return {
          label: item.budgetName,
          data: [actualExpenditure, remainingBudget],
          backgroundColor: backgroundColors[index % backgroundColors.length],
        };
      });

      console.log('pieChartData:', pieData);

      pieCanvas.chart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: pieData.map(item => item.label),
          datasets: [{
            data: pieData.map(item => item.data[0]),
            backgroundColor: pieData.map(item => item.backgroundColor),
          }],
        },
      });
    } catch (error) {
      console.error('Error creating pie chart: ', error);
    }
  };

const createLineChart = async () => {
  const lineCanvas = lineChartCanvasRef.current;

  if (!lineCanvas) {
    console.error('Line Canvas element not found');
    return;
  }

  const lineCtx = lineCanvas.getContext('2d');
  if (!lineCtx) {
    console.error('Unable to get 2D context for line canvas');
    return;
  }

  try {
    if (lineCanvas.chart) {
      lineCanvas.chart.destroy();
    }
    const cumulativeData = [];

    for (let month = 1; month <= 12; month++) {
      const budgetsResponse = await apiService.get(`/budgets/getAllBudgets/${month}`, authToken);
      const capacityResponse = await apiService.get(`/budgets/capacity/${month}`, authToken);
      const budgetData = budgetsResponse.data || [];
      const capacityData = capacityResponse.data || [];

      let totalBudget = 0;
      let totalCapacity = 0;

      for (const item of budgetData) {
        totalBudget += Number(item.budgetnumber) || 0;
      }

      for (const item of capacityData) {
        totalCapacity += Number(item.budgetnumber) || 0;
      }

      cumulativeData.push({
        month: month,
        totalBudget: totalBudget,
        totalCapacity: totalCapacity,
      });
    }

    const chartData = {
      labels: cumulativeData.map(item => item.month),
      datasets: [
        {
          label: 'Cumulative Actual Budget',
          backgroundColor: '#FF5733',
          borderColor: '#FF5733',
          data: cumulativeData.map(item => item.totalBudget),
          fill: false,
        },
        {
          label: 'Cumulative Budget',
          backgroundColor: '#33FF7E',
          borderColor: '#33FF7E',
          data: cumulativeData.map(item => item.totalCapacity),
          fill: false,
        },
        
      ],
    };

    lineCanvas.chart = new Chart(lineCtx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'category',
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          },
          y: {
            type: 'linear',
            position: 'left',
          },
        },
      },
    });
  } catch (error) {
    console.error('Error creating line chart: ', error);
  }
};

  const createBarChart = () => {
    const canvas = barChartCanvasRef.current;
    if (!canvas) {
      console.error('Bar Chart Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for Bar Chart canvas');
      return;
    }

    try {
      if (canvas.chart) {
        canvas.chart.destroy();
      }
      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetName: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            x: { stacked: true }, 
            y: { stacked: true }, 
          },
        },
      });
      const chartData = {
        labels: combinedData.map(item => item.budgetName),
        datasets: [
          {
            label: 'Actual Expenditure',
            backgroundColor: '#FF5733', 
            data: combinedData.map(item => item.actualExpenditure),
          },
          {
            label: 'Budget',
            backgroundColor: '#33FF7E', 
            data: combinedData.map(item => item.budgetCapacity),
          },
        ],
      };

    } catch (error) {
      console.error('Error creating bar chart: ', error);
    }
  };

  

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="budget-chart">
      <h3>Various Types of Budget Charts</h3>
      <div className="label-container">
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">All Months</option>
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="scrollable-container">
          <div className="charts-container">
            <div className="chart">
              <h3>Current Period Budget Allocation versus Cumulative Budget</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-canvas" ref={barChartCanvasRef} width={800} height={800}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
            <div className="chart">
              <h3>Current Period Budget Allocation</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-pie-canvas" ref={pieChartCanvasRef} width={800} height={800}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
          </div>

            <div className="chart">
              <h3>Current Period Budget Allocation versus Cumulative Budget</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-line-canvas" ref={lineChartCanvasRef} width={400} height={400}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomicChart;
