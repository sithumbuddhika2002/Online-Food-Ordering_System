import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, IconButton } from '@material-ui/core';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineStar } from 'react-icons/ai';
import Header from '../../Components/guest_header';
import Swal from 'sweetalert2';
import backgroundImage from '../../Images/Main.png';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const OrderButtonContainer = styled.div`
  position: absolute;
  top: 760px;
  right: 20px;
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
  height: 150px;
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
  border-radius: 50% !important;
  background-color: #d4ac0d !important;
  color: #333 !important;
  margin: 0 5px !important;
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;

  &:hover {
    background-color: ${(props) => props.hoverColor || '#e0e0e0'} !important;
  }

  .MuiIconButton-label {
    font-size: 16px !important;
  }
`;


const QuantityDisplay = styled.div`
  width: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;

const OrderButton = styled(Button)`
  margin-top: 20px !important;
  width: 100% !important;
  background-color: ${(props) => (props.ordered ? '#d4ac0d !important' : '#4CAF50 !important')};
  color: #fff !important;
  &:hover {
    background-color: ${(props) => (props.ordered ? '#bfae1d !important' : '#45a049 !important')};
  }
  margin-left: auto !important;
`;


const OrderMainButton = styled(Button)`
  margin-top: 100px !important;
  width: 200px !important;
  background-color: ${(props) => (props.ordered ? '#667a0e' : '#667a0e')} !important;
  color: #fff !important;

  &:hover {
    background-color: ${(props) => (props.ordered ? '#bfae1d' : '#45a049')} !important;
  }
`;


const BackgroundImageContainer = styled.div`
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  height: 350px;
  width: 100%;
  box-sizing: border-box;
`;

const ReviewIcon = styled(IconButton)`
  color: #f39c12;
  margin-left: 10px;
`;

const MenuPage = () => {
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

    const token = localStorage.getItem('token');

    if (!token) {
      return <Navigate to="/login" />;
    }
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
          <Title>Our Menu's For You</Title>
          <Description>Discover a delightful array of gourmet dishes and refreshing beverages, crafted to tantalize your taste buds and offer a memorable dining experience. Whether you're in the mood for a savory main course, a light and healthy salad, or an indulgent dessert, our menu has something for everyone. Each dish is prepared with the finest ingredients and a passion for culinary excellence. </Description>
          <OrderButtonContainer>
            <OrderMainButton variant="contained" onClick={handleOrder}>
              Order Now
            </OrderMainButton>
          </OrderButtonContainer>
        </TitleContainer>
        {Object.keys(groupedItems).map((category) => (
          <CategoryContainer key={category}>
            <CategoryTitle>{category}s</CategoryTitle>
            <MenuContainer>
              {groupedItems[category].map((item) => (
                <MenuCard key={item.menuItemId}>
                  <MenuItemImage src={item.menuImage} alt={item.menuItemName} />
                  <MenuItemName>{item.servingSize} {item.menuItemName}</MenuItemName>
                  <MenuItemDescription>{item.menuItemDescription}</MenuItemDescription>
                  <MenuItemPrice>Rs {item.price}</MenuItemPrice>
                  <QuantityContainer>
                    <QuantityButton onClick={() => handleQuantityChange(item.menuItemId, -1)} hoverColor="#e0e0e0">
                      <AiOutlineMinus />
                    </QuantityButton>
                    <QuantityDisplay>{quantities[item.menuItemId]}</QuantityDisplay>
                    <QuantityButton onClick={() => handleQuantityChange(item.menuItemId, 1)} hoverColor="#e0e0e0">
                      <AiOutlinePlus />
                    </QuantityButton>
                  </QuantityContainer>
                  <OrderButton 
                    variant="contained" 
                    ordered={orderedItems[item.menuItemId]} 
                    onClick={() => handleAddToCart(item)}
                  >
                    {orderedItems[item.menuItemId] ? 'Added' : 'Add to Order'}
                  </OrderButton>
                  <ReviewIcon onClick={() => handleReviewClick(item._id)}>
                    <AiOutlineStar /> 
                  </ReviewIcon>
                </MenuCard>
              ))}
            </MenuContainer>
          </CategoryContainer>
        ))}
      </HomePageContainer>
    </>
  );
};

export default MenuPage;
