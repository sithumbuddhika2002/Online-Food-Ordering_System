import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPizzaSlice, FaIceCream, FaUtensils, FaCocktail } from 'react-icons/fa';
import { Typography } from '@mui/material'; // Updated MUI import
import Sidebar from '../Components/sidebar';
import Header from '../Components/guest_header';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts'; // Import Recharts components

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack Header on top */
`;

const MainSection = styled.div`
  display: flex;
  flex-grow: 1;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-top: 70px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const BoxContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
`;

const Card = styled.div`
  background-color: ${(props) => props.color || '#fff'};
  width: 22%; /* Adjust width to fit 4 cards in a row */
  height: 150px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const ChartsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`;

const ChartSection = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const IconContainer = styled.div`
  margin-bottom: 10px;
`;

const Count = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const BarChartContainer = styled.div`
  padding: 10px;
`;

const PieChartContainer = styled.div`
  padding: 10px;
`;

const Dashboard = () => {
  const [categoryCounts, setCategoryCounts] = useState({
    'Main Courses': 0,
    Desserts: 0,
    Appetizers: 0,
    Beverages: 0,
  });

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3002/menu/category-counts');
        const counts = response.data.reduce((acc, item) => {
          acc[item.category] = item.count;
          return acc;
        }, {});
        setCategoryCounts({
          'Main Courses': counts['Main Course'] || 0,
          Desserts: counts['Dessert'] || 0,
          Appetizers: counts['Appetizer'] || 0,
          Beverages: counts['Beverage'] || 0,
        });
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);

  // Prepare data for the bar chart and pie chart
  const chartData = [
    { category: 'Main Courses', count: categoryCounts['Main Courses'] },
    { category: 'Desserts', count: categoryCounts['Desserts'] },
    { category: 'Appetizers', count: categoryCounts['Appetizers'] },
    { category: 'Beverages', count: categoryCounts['Beverages'] },
  ];

  const pieChartData = chartData.map((item) => ({
    name: item.category,
    value: item.count,
  }));

  // Define colors for each category
  const BAR_COLORS = {
    'Main Courses': '#FF5722',
    Desserts: '#FFC107',
    Appetizers: '#4CAF50',
    Beverages: '#2196F3',
  };

  const COLORS = ['#FF5722', '#FFC107', '#4CAF50', '#2196F3'];

  return (
    <DashboardContainer>
      <Header />
      <MainSection>
        <Sidebar />
        <MainContent>
          <Typography
            variant="h4"
            gutterBottom
            style={{
              marginBottom: '20px',
              fontFamily: 'cursive',
              fontWeight: 'bold',
              color: 'purple',
              textAlign: 'center',
            }}
          >
            Menu Dashboard
          </Typography>
          <BoxContainer>
            <CardContainer>
              <Card color="#FF5722">
                <IconContainer>
                  <FaPizzaSlice size={40} />
                </IconContainer>
                <div>Main Courses</div>
                <Count>{categoryCounts['Main Courses']}</Count>
              </Card>
              <Card color="#FFC107">
                <IconContainer>
                  <FaIceCream size={40} />
                </IconContainer>
                <div>Desserts</div>
                <Count>{categoryCounts['Desserts']}</Count>
              </Card>
              <Card color="#4CAF50">
                <IconContainer>
                  <FaUtensils size={40} />
                </IconContainer>
                <div>Appetizers</div>
                <Count>{categoryCounts['Appetizers']}</Count>
              </Card>
              <Card color="#2196F3">
                <IconContainer>
                  <FaCocktail size={40} />
                </IconContainer>
                <div>Beverages</div>
                <Count>{categoryCounts['Beverages']}</Count>
              </Card>
            </CardContainer>
          </BoxContainer>

          <ChartsRow>
            {/* Bar Chart Section */}
            <ChartSection>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  marginBottom: '20px',
                  fontFamily: 'cursive',
                  fontWeight: 'bold',
                  color: 'purple',
                  textAlign: 'center',
                }}
              >
                Category Counts
              </Typography>
              <BarChartContainer>
                <BarChart width={500} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count">
                    {chartData.map((entry) => (
                      <Cell key={entry.category} fill={BAR_COLORS[entry.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </BarChartContainer>
            </ChartSection>

            {/* Pie Chart Section */}
            <ChartSection>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  marginBottom: '20px',
                  fontFamily: 'cursive',
                  fontWeight: 'bold',
                  color: 'purple',
                  textAlign: 'center',
                }}
              >
                Category Distribution
              </Typography>
              <PieChartContainer>
                <PieChart width={400} height={250}>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </PieChartContainer>
            </ChartSection>
          </ChartsRow>
        </MainContent>
      </MainSection>
    </DashboardContainer>
  );
};

export default Dashboard;
