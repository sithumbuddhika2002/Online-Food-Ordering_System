import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, TextField, Paper, Grid } from '@material-ui/core';
import { Rating } from '@mui/material';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; // Correct import
import Header from '../../Components/guest_header';

// Styled Components
const UpdateReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: linear-gradient(to bottom right, #f9f9f9, #e8e8e8);
  min-height: 100vh;
`;

const UpdateReviewForm = styled(Paper)`
  padding: 20px;
  margin-top: 20px;
  width: 80%;
  background-color: #fff;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const ReviewDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  margin-bottom: 20px;
`;

// Main Component
const UpdateReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState({
    reviewText: '',
    rating: 0,
  });
  const [foodInfo, setFoodInfo] = useState(null); // State for food information
  const [userId, setUserId] = useState(null);

// Fetch existing review details and food information
useEffect(() => {
  const fetchReview = async () => {
    try {
      const response = await fetch(`http://localhost:3002/review/get-review/${id}`);
      const data = await response.json();

      // Check if the review status is approved
      if (data && typeof data === 'object' && data.status === 'approved') {
        setReview({
          reviewText: data.review,
          rating: data.rating,
          price: data.price,
          servingSize: data.servingSize,
        });
        setFoodInfo(data.menuItem); // Set food information
      } else {
        console.error('Review not approved or unexpected data format:', data);
        Swal.fire('Error', 'Review not approved or not found.', 'error');
        navigate(-1); // Navigate back if review is not approved
      }
    } catch (error) {
      console.error('Error fetching review:', error);
      Swal.fire('Error', 'Failed to fetch review. Please try again.', 'error');
    }
  };

  fetchReview();
}, [id, navigate]);


  // Fetch logged-in user info from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value, // Update the review state
    }));
  };

  // Handle Rating change
  const handleRatingChange = (event, newValue) => {
    setReview((prevReview) => ({
      ...prevReview,
      rating: newValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3002/review/update-review/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: review.reviewText,
          rating: review.rating,
          userId,
        }),
      });

      if (response.ok) {
        Swal.fire('Success', 'Review updated successfully!', 'success');
      } else {
        Swal.fire('Error', 'Failed to update review. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      Swal.fire('Error', 'Failed to update review. Please try again.', 'error');
    }
  };

  // Navigate to previous page
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
      <Header />
      <UpdateReviewContainer>
        <SectionTitle style={{ fontSize: '40px', fontFamily: 'cursive', color: 'purple' }}>
          Update Review
        </SectionTitle>

        {foodInfo && (
          <ReviewDetailsContainer style={{ alignItems: 'center', textAlign: 'center' }}>
            <ImageContainer>
              <img src={foodInfo.menuImage} alt={foodInfo.menuItemName} />
            </ImageContainer>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '35px', fontFamily: 'cursive', color: 'green' }}>
                {foodInfo.menuItemName}
              </p>
              <p style={{ fontWeight: 'bold', fontSize: '25px', fontFamily: 'cursive', color: 'orange' }}>
                Rs {review.price} - {review.servingSize}
              </p>
            </div>
          </ReviewDetailsContainer>
        )}

        <UpdateReviewForm elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Review"
                  name="reviewText"
                  value={review.reviewText}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Rating
                  name="rating"
                  value={review.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                  size="large"
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Update Review
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={handleBack} variant="contained" color="secondary" fullWidth>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </UpdateReviewForm>
      </UpdateReviewContainer>
    </>
  );
};

export default UpdateReview;
