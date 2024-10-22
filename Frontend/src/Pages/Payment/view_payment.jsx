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
    minHeight: '240vh',
    height: 'calc(100vh - 60px)', 
    overflow: 'auto',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto', 
  },
}));

const ViewPayment = () => {
  const classes = useStyles();
  const [paymentData, setPaymentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("firstName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/payment/get-payments');
        setPaymentData(response.data);
      } catch (error) {
        console.error("There was an error fetching the payment data!", error);
      }
    };

    fetchPaymentData();
  }, []);

  const handleUpdate = (paymentId) => {
    console.log(`Update payment with ID: ${paymentId}`);
    navigate(`/update-payment/${paymentId}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/payment/delete-payment/${id}`);
      setPaymentData(paymentData.filter(paymentItem => paymentItem._id !== id));
    } catch (error) {
      console.error("There was an error deleting the payment item!", error);
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

  const filteredPayment = paymentData.filter(paymentItem => {
    if (!searchQuery) return true;
    const field = paymentItem[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedPayment = filteredPayment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header />
      <Box display="flex" flexDirection="row">
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
              Payment Overview
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="firstName">First Name</MenuItem>
                  <MenuItem value="lastName">Last Name</MenuItem>
                  <MenuItem value="totalPrice">Total Price</MenuItem>
                  <MenuItem value="deliveryDistrict">Delivery District</MenuItem>
                  <MenuItem value="cardType">Card Type</MenuItem>
                  <MenuItem value="cardNumber">Card Number</MenuItem>
                  <MenuItem value="expiryDate">Expiry Date</MenuItem>
                  <MenuItem value="cvv">CVV</MenuItem>
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
                  <TableCell style={{ color: 'white' }}>First Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Last Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Total Price</TableCell>
                  <TableCell style={{ color: 'white' }}>Delivery District</TableCell>
                  <TableCell style={{ color: 'white' }}>Card Type</TableCell>
                  <TableCell style={{ color: 'white' }}>Card Number</TableCell>
                  <TableCell style={{ color: 'white' }}>Expiry Date</TableCell>
                  <TableCell style={{ color: 'white' }}>CVV</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPayment.map((paymentItem) => (
                  <TableRow key={paymentItem._id}>
                    <TableCell>{paymentItem.firstName}</TableCell>
                    <TableCell>{paymentItem.lastName}</TableCell>
                    <TableCell>Rs {paymentItem.totalPrice}</TableCell>
                    <TableCell>{paymentItem.deliveryDistrict}</TableCell>
                    <TableCell>{paymentItem.cardType}</TableCell>
                    <TableCell>
  {paymentItem.cardNumber ? `${paymentItem.cardNumber.slice(0, -3)}XXX` : 'N/A'}
</TableCell>
                    <TableCell>{paymentItem.expiryDate}</TableCell>
                    <TableCell>{paymentItem.cvv}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(paymentItem._id)}
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
            count={filteredPayment.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPayment;
