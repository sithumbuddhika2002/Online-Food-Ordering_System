import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom'; // for navigation in React Router v6
import { Card, CardContent, Typography } from '@material-ui/core';
import Header from '../../Components/guest_header'; // Assuming you have this header component

// Global styles to set the background color for the whole page
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f5f5f5;
    margin: 0; /* Remove default margin */
    padding: 0; /* Remove default padding */
    font-family: Arial, sans-serif; /* Optional: Set a default font */
  }
`;

// Styled-components for dashboard layout
const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap; 
  justify-content: space-between;
  padding: 40px;
  min-height: 100vh;
`;

const DashboardTitle = styled(Typography)`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin: 40px 0;
`;

const DashboardCard = styled(Card)`
  width: 23%; /* Adjust to fit 4 cards in a row with some spacing */
  margin-bottom: 30px;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CardContentStyled = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px; /* Ensure content is centered */
`;

const CardTitle = styled(Typography)`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
`;

const CardIcon = styled.img`
  width: 180px; /* Set icon image size */
  height: 180px;
  object-fit: contain;
  text-align: center;
  margin-top: 65px;
`;

// Updated DashboardPage component
const DashboardPage = () => {
  const navigate = useNavigate(); // Replaces useHistory

  // Updated card data with appropriate image URLs for icons
  const cards = [
    { title: 'User Management', icon: 'https://cdn3d.iconscout.com/3d/premium/thumb/businessman-approval-11383354-9395553.png?f=webp', route: '/admin/user' },
    { title: 'Inventory Management', icon: 'https://cdn3d.iconscout.com/3d/premium/thumb/stock-management-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--inventory-warehouse-checklist-check-delivery-girl-pack-illustrations-8437095.png?f=webp', route: '/view-inventory' },
    { title: 'Quality Assurance', icon: 'https://static.vecteezy.com/system/resources/previews/013/822/343/original/gear-setting-quality-control-3d-illustration-png.png', route: '/admin/quality-assurance' },
    { title: 'Employee Management', icon: 'https://static.vecteezy.com/system/resources/previews/016/329/354/original/3d-illustration-business-team-png.png', route: '/admin/employee' },
    { title: 'Marketing', icon: 'https://cdn3d.iconscout.com/3d/premium/thumb/megaphone-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--loudspeaker-bullhorn-announcement-customer-support-pack-tech-illustrations-4497575.png?f=webp', route: '/admin/marketing' },
    { title: 'Delivery', icon: 'https://img.freepik.com/premium-photo/3d-cartoon-cute-style-illustration-delivery-order-with-white-background_564992-345.jpg', route: '/admin/delivery' },
    { title: 'Payment', icon: 'https://img.freepik.com/free-vector/bill-receipt-credit-card-3d-illustration-cartoon-drawing-paper-sheet-with-dollar-symbol-credit-card-3d-style-white-background-business-payment-finances-transaction-concept_778687-705.jpg', route: '/admin/payment' },
    { title: 'Review Management', icon: 'https://thumbs.dreamstime.com/b/product-review-d-illustration-icon-render-high-resolution-png-file-isolated-transparent-background-274530207.jpg', route: '/admin/review' },
  ];

  // Function to handle card click
  const handleCardClick = (route) => {
    navigate(route); // Navigate to the selected admin page
  };

  return (
    <>
      <GlobalStyle /> {/* Apply global styles */}
      <Header />
      <DashboardTitle variant="h1" style={{fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center'}}>Admin Dashboard</DashboardTitle> 
      <DashboardContainer>
        {cards.map((card, index) => (
          <DashboardCard key={index} onClick={() => handleCardClick(card.route)}>
            <CardContentStyled>
              <CardIcon src={card.icon} alt={card.title} />
              <CardTitle>{card.title}</CardTitle>
            </CardContentStyled>
          </DashboardCard>
        ))}
      </DashboardContainer>
    </>
  );
};

export default DashboardPage;
