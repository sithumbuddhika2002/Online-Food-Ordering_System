import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, IconButton } from '@material-ui/core';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineStar } from 'react-icons/ai'; // Import star icon
import Header from '../../Components/guest_header';
import Swal from 'sweetalert2';
import backgroundImage from '../../Images/lok.jpg';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const OrderButtonContainer = styled.div`
  position: absolute;
  top: 650px;
  right: 100px;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
  margin-top: 50px;
`;

const Description = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
`;

const CategoryContainer = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const CategoryTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 30px;
  color: #333;
  text-align: center;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
`;

const MenuCard = styled.div`
  background-color: #fff;
  flex-basis: calc(23% - 20px);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
`;

const MenuItemImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
  margin-bottom: 15px;
`;

const MenuItemName = styled.h3`
  margin-bottom: 10px;
  font-size: 25px;
  color: #333;
`;

const MenuItemDescription = styled.p`
  font-size: 18px;
  color: #777;
  margin: 2px;
`;

const MenuItemPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 15px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuantityButton = styled(IconButton)`
  border-radius: 50%;
  background-color: #d4ac0d;
  color: #333;
  margin: 0 5px;
  width: 32px;
  height: 32px; 
  padding: 0; 

  &:hover {
    background-color: ${(props) => props.hoverColor || '#e0e0e0'};
  }

  .MuiIconButton-label {
    font-size: 16px; 
  }
`;

const QuantityDisplay = styled.div`
  width: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;

const OrderButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  background-color: ${(props) => (props.ordered ? '#d4ac0d' : '#4CAF50')};
  color: #fff;
  &:hover {
    background-color: ${(props) => (props.ordered ? '#bfae1d' : '#45a049')};
  }
  margin-left: auto; 
`;

const OrderMainButton = styled(Button)`
  margin-top: 10px;
  width: 150px; /* Fixed width */
  background-color: ${(props) => (props.ordered ? '#d4ac0d' : '#4CAF50')};
  color: #fff;
  &:hover {
    background-color: ${(props) => (props.ordered ? '#bfae1d' : '#45a049')};
  }
  margin-left: auto;
`;

const BackgroundImageContainer = styled.div`
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  height: 600px;
  width: 100%;
  box-sizing: border-box;
`;

const ReviewIcon = styled(IconButton)`
  color: #f39c12;
  margin-left: 10px;
`;

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});
  const [orderedItems, setOrderedItems] = useState({});
  const [ordersPlaced, setOrdersPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3002/menu/get-menu-items');
        const data = await response.json();
        setMenuItems(data);

        const initialQuantities = data.reduce((acc, item) => {
          acc[item.menuItemId] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleQuantityChange = (id, delta) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(1, prevQuantities[id] + delta),
    }));
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.menuItemId]) {
        newCart[item.menuItemId].quantity += quantities[item.menuItemId];
      } else {
        newCart[item.menuItemId] = { ...item, quantity: quantities[item.menuItemId] };
      }
      return newCart;
    });

    setOrderedItems((prevOrdered) => ({
      ...prevOrdered,
      [item.menuItemId]: true,
    }));

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.menuItemId]: 1,
    }));
  };

  const handleOrder = () => {
    const orderCount = Object.keys(orderedItems).length;
    if (orderCount === 0) { 
      Swal.fire({
        icon: 'error',
        title: 'No Orders Placed',
        text: 'Please add items to your order before proceeding.',
        confirmButtonText: 'OK'
      });
    } else {
      navigate('/order-page', { state: { cart } });
    }
  };

  const handleReviewClick = (menuItemId) => {
    navigate(`/review/${menuItemId}`);
  };

  return (
    <>
      <Header />
      <HomePageContainer>
        <BackgroundImageContainer backgroundImage={backgroundImage} />
        <TitleContainer>
          <Title>Welcome to Land of Kings Café & Restaurant</Title>
          <Description>The Land of Kings Cafe & Restaurant has recently made a name for itself as the first-ever Game of Thrones themed cafe and restaurant in Sri Lanka. This establishment is not only unique in its theme but also in its commitment to serving safe food at your doorsteps, ensuring the highest standard in safety and quality.</Description>           
        </TitleContainer>
      </HomePageContainer>
    </>
  );
};

export default HomePage;
