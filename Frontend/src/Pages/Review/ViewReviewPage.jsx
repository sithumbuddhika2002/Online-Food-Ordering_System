import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]}
      labelRowsPerPage=""
    />
  );
};

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewReviews = () => {
  const classes = useStyles();
  const [reviewsData, setReviewsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("foodName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/review/get-reviews');
        setReviewsData(response.data);
      } catch (error) {
        console.error("There was an error fetching the reviews data!", error);
      }
    };

    fetchReviewsData();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      await axios.put(`http://localhost:3002/review/update-review-status/${reviewId}`, { status: 'approved' });
      setReviewsData(reviewsData.map(review => review._id === reviewId ? { ...review, status: 'approved' } : review));
    } catch (error) {
      console.error("There was an error approving the review!", error);
    }
  };

  const handleFlag = async (reviewId) => {
    try {
      await axios.put(`http://localhost:3002/review/update-review-status/${reviewId}`, { status: 'flagged' });
      setReviewsData(reviewsData.map(review => review._id === reviewId ? { ...review, status: 'flagged' } : review));
    } catch (error) {
      console.error("There was an error flagging the review!", error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3002/review/delete-review/${reviewId}`);
      setReviewsData(reviewsData.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error("There was an error deleting the review!", error);
    }
  };
  

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredReviews = reviewsData.filter(review => {
    if (!searchQuery) return true;
    const field = review[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedReviews = filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header />
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Reviews
            </Typography>
            <Box display="flex" alignItems="center">
            <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                    value={searchCriteria}
                    onChange={handleCriteriaChange}
                    label="Search By"
                >
                    <MenuItem value="foodName">Food Name</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="servingSize">Serving Size</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem> {/* Added rating criteria */}
                    <MenuItem value="review">Review</MenuItem> {/* Added review criteria */}
                </Select>
            </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Food Name</TableCell>
                  <TableCell style={{ color: 'white' }}>User</TableCell>
                  <TableCell style={{ color: 'white' }}>Price</TableCell>
                  <TableCell style={{ color: 'white' }}>Serving Size</TableCell>
                  <TableCell style={{ color: 'white' }}>Review</TableCell>
                  <TableCell style={{ color: 'white' }}>Rating</TableCell>
                  <TableCell style={{ color: 'white' }}>Status</TableCell>
                  <TableCell style={{ color: 'white' }}>Approve</TableCell>
                  <TableCell style={{ color: 'white' }}>Flag</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>{review._id.slice(-5)}</TableCell>
                    <TableCell>{review.foodName}</TableCell>
                    <TableCell>{review.user ? review.user.firstName || 'No User' : 'No User'}</TableCell>
                    <TableCell>{review.price}</TableCell>
                    <TableCell>{review.servingSize}</TableCell>
                    <TableCell>{review.review}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleApprove(review._id)}
                        disabled={review.status === 'approved'}
                      >
                        Approve
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleFlag(review._id)}
                        disabled={review.status === 'flagged'}
                      >
                        Flag
                      </Button>
                    </TableCell>
                    <TableCell>
                        <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(review._id)}
                        >
                        Delete
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredReviews.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewReviews;
