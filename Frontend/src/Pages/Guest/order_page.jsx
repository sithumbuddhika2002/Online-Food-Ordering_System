import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, IconButton } from '@material-ui/core';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import Navbar from '../../Components/guest_header'; 

const OrderPageContainer = styled.div`
  padding: 20px;
  background-color: #000000;
  min-height: 100vh;
`;

const PopupContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
`;

const PopupTitle = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const OrderItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #8B4513; 
`;

const OrderItemNameContainer = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 
  margin-left: 20px; 
`;

const OrderItemName = styled.span`
  font-size: 21px;
  font-weight: bold;
  color: #333;
  text-align: left; 
`;

const OrderItemSize = styled.span`
  font-size: 18px;
  color: #666;
  text-align: left;
`;

const OrderItemImage = styled.img`
  width: 200px;
  height: 100px;
  margin-right: 15px;
  object-fit: cover;
`;

const OrderItemDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%; 
`;

const OrderItemQuantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: 20px;
`;

const RemoveIconButton = styled(IconButton)`
  background-color: #f44336;
  color: white;
  width: 48px; 
  height: 48px; 
  margin-right: 20px;
  padding: 10px; 

  &:hover {
    background-color: #e53935;
  }
`;

const TotalContainer = styled.div`
  text-align: right;
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
  gap: 20px;
`;

const MakeDeliveryButton = styled(Button)`
  && {
    background-color: #4caf50;
    color: #fff;
    padding: 12px 30px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 8px;
    &:hover {
      background-color: #43a047;
    }
  }
`;

const BackButton = styled(Button)`
  && {
    background-color: #9e9e9e;
    color: #fff;
    padding: 12px 30px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 8px;
    &:hover {
      background-color: #757575;
    }
  }
`;

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(location.state?.cart || {}); 
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Initialize quantities based on the cart
    const initialQuantities = {};
    Object.values(cart).forEach((item) => {
      initialQuantities[item.menuItemId] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  const handleRemoveItem = (id) => {
    const updatedCart = { ...cart };
    delete updatedCart[id];
    setCart(updatedCart);

    // Update quantities as well
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[id];
    setQuantities(updatedQuantities);
  };

  const handleIncreaseQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1,
    }));
  };

  const handleDecreaseQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] > 1 ? prevQuantities[id] - 1 : 1,
    }));
  };

  const handleMakeDelivery = () => {
    // Create an array of items with name, quantity, and price
    const orderedItems = Object.values(cart).map(item => ({
      itemName: item.menuItemName,
      quantity: quantities[item.menuItemId],
      price: item.price
    }));
  
    // Calculate total price
    const totalPrice = orderedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  
    // Pass data to the delivery page
    navigate('/delivery-page', {
      state: { orderedItems, totalPrice }
    });
  };
  

  const totalPrice = Object.values(cart).reduce((sum, item) => {
    const quantity = quantities[item.menuItemId] || item.quantity || 1;
    return sum + quantity * item.price;
  }, 0);

  return (
    <OrderPageContainer>
      <Navbar /> 
      <PopupContainer>
        <PopupTitle>Cart</PopupTitle>
        <OrderList>
          {Object.values(cart).length > 0 ? (
            Object.values(cart).map((item) => (
              <OrderItem key={item.menuItemId}>
                <OrderItemImage
                  src={item.menuImage}
                  alt={item.menuItemName}
                />
                <OrderItemDetails>
                  <OrderItemNameContainer>
                    <OrderItemSize>{item.servingSize}</OrderItemSize>
                    <OrderItemName>{item.menuItemName}</OrderItemName>
                  </OrderItemNameContainer>
                  <OrderItemQuantity>
                    <QuantityButton
                      onClick={() =>
                        handleDecreaseQuantity(item.menuItemId)
                      }
                    >
                      <AiOutlineMinus />
                    </QuantityButton>
                    {quantities[item.menuItemId]}
                    <QuantityButton
                      onClick={() =>
                        handleIncreaseQuantity(item.menuItemId)
                      }
                    >
                      <AiOutlinePlus />
                    </QuantityButton>
                  </OrderItemQuantity>
                  <Price>
                    Rs {(quantities[item.menuItemId] * item.price).toFixed(2)}
                  </Price>
                  <RemoveIconButton
                    onClick={() => handleRemoveItem(item.menuItemId)}
                  >
                    <AiOutlineDelete />
                  </RemoveIconButton>
                </OrderItemDetails>
              </OrderItem>
            ))
          ) : (
            <p>No items in your cart.</p>
          )}
        </OrderList>
        <TotalContainer>Total: Rs {totalPrice.toFixed(2)}</TotalContainer>
        <ButtonsContainer>
          <BackButton onClick={() => navigate(-1)}>Back to Menu</BackButton>
          <MakeDeliveryButton onClick={handleMakeDelivery}>
            Make a Delivery
          </MakeDeliveryButton>
        </ButtonsContainer>
      </PopupContainer>
    </OrderPageContainer>
  );
};

export default OrderPage;
