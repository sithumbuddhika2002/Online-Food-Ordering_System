import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, TextField } from '@material-ui/core';
import { Rating } from '@mui/material';
import Swal from 'sweetalert2';
import Header from '../../Components/guest_header';
import Chatbot from '../../Components/chatbot';
import { jwtDecode } from 'jwt-decode';
import UpdateReviewForm from '../../Pages/Review/UpdateReview';

// Styled Components
const ReviewPageContainer = styled.div`
  display: flex;
  padding: 40px;
  background: linear-gradient(to bottom right, #f9f9f9, #e8e8e8);
  min-height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  max-width: 800px;
  margin-right: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  padding: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const MenuItemDetails = styled.div`
  display: flex;
  background-color: #f1f1f1;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
`;

const MenuItemImage = styled.img`
  max-width: 200px;
  height: auto;
  border-radius: 10px;
  margin-right: 20px;
`;

const MenuItemName = styled.div`
  font-size: 30px;
  color: #333;
  margin-bottom: 15px;
`;

const MenuItemServingSize = styled.div`
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
`;

const MenuItemPrice = styled.div`
  font-size: 20px;
  color: #777;
`;

const ReviewForm = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ReviewTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const RatingWrapper = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: #ffb400;
    font-size: 3rem;
  }
  & .MuiRating-iconEmpty {
    color: #e0e0e0;
    font-size: 3rem;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4caf50 !important;
  color: white !important;
  font-weight: bold !important;
  width: 100%;

  &:hover {
    background-color: #45a049 !important;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const EditButton = styled(Button)`
  background-color: #2196f3 !important;
  color: white !important;
  font-weight: bold !important;
  margin-top: 20px;

  &:hover {
    background-color: #1e88e5 !important;
  }
`;

const ReviewPage = () => {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submittedReview, setSubmittedReview] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello, I am Sara. Please review our food. Your feedback is valuable to us." },
  ]);

  useEffect(() => {
    const fetchMenuItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/menu/get-menu-item/${menuItemId}`);
        const data = await response.json();
        setMenuItem(data);
      } catch (error) {
        console.error('Error fetching menu item details:', error);
      }
    };

    fetchMenuItemDetails();
  }, [menuItemId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);

        try {
          const response = await fetch(`http://localhost:3002/user/user/${decodedToken.id}`);
          const data = await response.json();
          setUserName(data.firstName);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
      setLoadingUserInfo(false);
    };

    fetchUserInfo();
  }, []);

  const handleSendReview = (reviewText) => {
    if (reviewText.trim() !== '') {
      const newMessages = [
        ...chatMessages,
        { sender: 'user', text: reviewText },
      ];
      setChatMessages(newMessages);
      setSubmittedReview(reviewText);
    }
  };

  const handleSubmitReview = async () => {
    if (!review || rating === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Submission',
        text: 'Please provide both a review and a star rating.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/review/add-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItemId,
          review,
          rating,
          userId,
        }),
      });

      if (response.ok) {
        handleSendReview(review);

        Swal.fire({
          icon: 'success',
          title: 'Review Submitted',
          text: 'Thank you for your feedback!',
        });

        setReview('');
        setRating(0);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Something went wrong. Please try again.',
      });
    }
  };

  if (!menuItem) {
    return <div>Loading...</div>;
  }

  const handleEditReview = () => {
    navigate(`/edit-review/${menuItemId}`);
  };

  if (loadingUserInfo) {
    return <div>Loading user info...</div>;
  }

  return (
    <>
      <Header>
        <HeaderTitle>Write a Review</HeaderTitle>
      </Header>

      <ReviewPageContainer>
        <ContentArea>
          <Title>Review for {menuItem.menuItemName} by {userName}</Title>

          <MenuItemDetails>
            <MenuItemImage src={menuItem.menuImage} alt={menuItem.menuItemName} />
            <div>
              <MenuItemName>{menuItem.menuItemName}</MenuItemName>
              <MenuItemServingSize>{menuItem.servingSize}</MenuItemServingSize>
              <MenuItemPrice>${menuItem.price}</MenuItemPrice>
            </div>
          </MenuItemDetails>

          <ReviewForm>
            <ReviewTextField
              label="Your Review"
              multiline
              rows={4}
              variant="outlined"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <RatingWrapper>
              <StyledRating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <div>Your Rating: {rating}</div>
            </RatingWrapper>

            <SubmitButton onClick={handleSubmitReview}>Submit Review</SubmitButton>
          </ReviewForm>
        </ContentArea>

        <Chatbot userReview={submittedReview} chatMessages={chatMessages} />
      </ReviewPageContainer>
      <UpdateReviewForm menuItemId={menuItemId} userId={userId} />
    </>
  );
};

export default ReviewPage;
