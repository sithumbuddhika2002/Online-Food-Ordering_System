import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { Rating } from '@mui/material';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

// Styled Components
const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: linear-gradient(to bottom right, #f9f9f9, #e8e8e8);
  min-height: 100vh;
`;

const ReviewTable = styled(TableContainer)`
  margin-top: 20px;
`;

const EditButton = styled(Button)`
  background-color: #4caf50 !important;
  color: white !important;
  font-weight: bold !important;

  &:hover {
    background-color: #45a049 !important;
  }
`;

const EditReviewPage = () => {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null); // Store logged-in user ID
  const [menuItemName, setMenuItemName] = useState(''); // State to store menu item name

  // Fetch reviews for the menu item
    useEffect(() => {
        const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:3002/review/get-reviews-by-menu/${menuItemId}`);
            const data = await response.json();
    
            // Filter reviews to include only those with 'approved' status
            const approvedReviews = data.filter((review) => review.status === 'approved');
            setReviews(approvedReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
        };
    
        fetchReviews();
    }, [menuItemId]);
    

    // Fetch menu item name
    useEffect(() => {
        const fetchMenuItem = async () => {
          try {
            const response = await fetch(`http://localhost:3002/menu/get-menu-item/${menuItemId}`);
            const data = await response.json();
            setMenuItemName(data.menuItemName || 'Menu Item'); // Assuming the API returns an object with 'menuItemName'
          } catch (error) {
            console.error('Error fetching menu item:', error);
            setMenuItemName('Menu Item'); // Fallback name in case of error
          }
        };
    
        fetchMenuItem();
      }, [menuItemId]);

  // Fetch logged-in user info from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id); // Set logged-in user ID
    }
  }, []);

  const handleEditClick = (reviewId) => {
    navigate(`/review/edit/${reviewId}`); // Navigate to the edit page for the selected review
  };

  return (
    <ReviewsContainer>
      <h1 style={{fontFamily: 'cursive', textAlign:'center', color:'purple'}}>User Reviews for {menuItemName || ' Menu Item'}</h1>

      {reviews.length === 0 ? (
        <p>No reviews found for this menu item.</p>
      ) : (
        <ReviewTable component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{backgroundColor:'orange'}}>
                <TableCell style={{color:'white', fontSize:'20px'}}>User</TableCell>
                <TableCell style={{color:'white', fontSize:'20px'}}>Review</TableCell>
                <TableCell style={{color:'white', fontSize:'20px'}}>Rating</TableCell>
                <TableCell style={{color:'white', fontSize:'20px'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    <img
                      src={review.user && review.user.profileImage ? review.user.profileImage : "https://cdn-icons-png.flaticon.com/512/8792/8792047.png"} // Fallback to this image
                      alt="Profile"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '15px',
                      }}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if fallback image fails
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/8792/8792047.png"; // Set to fallback image
                      }}
                    />
                    {review.user ? review.user.firstName || 'No User' : 'No User'}
                  </TableCell>

                  <TableCell>{review.review}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly />
                  </TableCell>
                  <TableCell>
                    {review.user && review.user._id === userId && ( // Only show edit button for reviews by the logged-in user
                      <EditButton
                        variant="contained"
                        onClick={() => handleEditClick(review._id)}
                      >
                        Edit
                      </EditButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ReviewTable>
      )}
    </ReviewsContainer>
  );
};

export default EditReviewPage;
