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
    minHeight: '250vh', 
    height: 'calc(100vh - 60px)',
    overflow: 'auto', 
  },
  tableContainer: {
    width: '100%',
  },
}));

const ViewDelivery = () => {
  const classes = useStyles();
  const [deliveryData, setDeliveryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("firstName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/delivery/get-deliveries');
        setDeliveryData(response.data);
      } catch (error) {
        console.error("There was an error fetching the delivery data!", error);
      }
    };

    fetchDeliveryData();
  }, []);

  const handleUpdate = (deliveryId) => {
    console.log(`Update delivery with ID: ${deliveryId}`);
    navigate(`/update-delivery/${deliveryId}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/delivery/delete-delivery/${id}`);
      setDeliveryData(deliveryData.filter(deliveryItem => deliveryItem._id !== id));
    } catch (error) {
      console.error("There was an error deleting the delivery item!", error);
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

  const filteredDelivery = deliveryData.filter(deliveryItem => {
    if (!searchQuery) return true;
    const field = deliveryItem[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedDelivery = filteredDelivery.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header />
      <Box display="flex" flexDirection="row" height="100%">
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
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
              Delivery Overview
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
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="city">City</MenuItem>
                  <MenuItem value="deliveryDistrict">District</MenuItem>
                  <MenuItem value="deliveryDate">Delivery Date</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsappNo">WhatsApp No</MenuItem>
                  <MenuItem value="orderNotes">Order Notes</MenuItem>
                  <MenuItem value="totalPrice">Total Price</MenuItem>
                  <MenuItem value="_id">Delivery ID</MenuItem> 
                  <MenuItem value="status">Status</MenuItem> 
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
                  <TableCell style={{ color: 'white' }}>Delivery ID</TableCell>
                  <TableCell style={{ color: 'white' }}>First Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Last Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Address</TableCell>
                  <TableCell style={{ color: 'white' }}>City</TableCell>
                  <TableCell style={{ color: 'white' }}>District</TableCell>
                  <TableCell style={{ color: 'white' }}>Delivery Date</TableCell>
                  <TableCell style={{ color: 'white' }}>Phone</TableCell>
                  <TableCell style={{ color: 'white' }}>Email</TableCell>
                  <TableCell style={{ color: 'white' }}>WhatsApp No</TableCell>
                  <TableCell style={{ color: 'white' }}>Order Notes</TableCell>
                  <TableCell style={{ color: 'white' }}>Total Price</TableCell>
                  <TableCell style={{ color: 'white' }}>Status</TableCell> 
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDelivery.map((deliveryItem) => (
                  <TableRow key={deliveryItem._id}>
                    <TableCell>{deliveryItem.deliveryId ? deliveryItem.deliveryId.substring(0, 5) : 'N/A'}</TableCell>
                    <TableCell>{deliveryItem.firstName}</TableCell>
                    <TableCell>{deliveryItem.lastName}</TableCell>
                    <TableCell>{deliveryItem.address}</TableCell>
                    <TableCell>{deliveryItem.city}</TableCell>
                    <TableCell>{deliveryItem.deliveryDistrict}</TableCell>
                    <TableCell>{new Date(deliveryItem.deliveryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{deliveryItem.phone}</TableCell>
                    <TableCell>{deliveryItem.email}</TableCell>
                    <TableCell>{deliveryItem.whatsappNo}</TableCell>
                    <TableCell>{deliveryItem.orderNotes}</TableCell>
                    <TableCell>Rs {deliveryItem.totalPrice}</TableCell>
                    <TableCell>{deliveryItem.status}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleUpdate(deliveryItem._id)}>
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(deliveryItem._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredDelivery.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewDelivery;
