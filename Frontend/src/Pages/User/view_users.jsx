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
    overflow: 'auto',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewUsers = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("emailAddress");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/user/get-users');
        setUserData(response.data);
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = (userId) => {
    console.log(`Update user with ID: ${userId}`);
    navigate(`/update-user/${userId}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/user/user/${id}`);
      setUserData(userData.filter(user => user._id !== id));
    } catch (error) {
      console.error("There was an error deleting the user!", error);
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

  const filteredUsers = userData.filter(user => {
    if (!searchQuery) return true;
    const field = user[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              User List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                    value={searchCriteria}
                    onChange={handleCriteriaChange}
                    label="Search By"
                    >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="firstName">First Name</MenuItem>
                    <MenuItem value="lastName">Last Name</MenuItem>
                    <MenuItem value="emailAddress">Email</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="NIC">NIC</MenuItem>
                    <MenuItem value="address">Address</MenuItem>
                    <MenuItem value="dateOfBirth">Date of Birth</MenuItem>
                    <MenuItem value="city">City</MenuItem>
                    <MenuItem value="district">District</MenuItem>
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
                  <TableCell style={{ color: 'white' }}>Title</TableCell>
                  <TableCell style={{ color: 'white' }}>Full Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Address</TableCell>
                  <TableCell style={{ color: 'white' }}>NIC</TableCell>
                  <TableCell style={{ color: 'white' }}>DOB</TableCell>
                  <TableCell style={{ color: 'white' }}>Contact</TableCell>
                  <TableCell style={{ color: 'white' }}>Email</TableCell>
                  <TableCell style={{ color: 'white' }}>City</TableCell>
                  <TableCell style={{ color: 'white' }}>District</TableCell>
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id.slice(0, 5)}</TableCell>
                    <TableCell>{user.title}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.NIC}</TableCell>
                    <TableCell>{new Date(user.DOB).toLocaleDateString()}</TableCell>
                    <TableCell>{user.contact}</TableCell>
                    <TableCell>{user.emailAddress}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.district}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpdate(user._id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(user._id)}
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
            count={filteredUsers.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewUsers;
