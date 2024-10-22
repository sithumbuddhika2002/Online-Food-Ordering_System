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

const ViewMenu = () => {
  const classes = useStyles();
  const [menuData, setMenuData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("menuItemName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/menu/get-menu-items');
        setMenuData(response.data);
      } catch (error) {
        console.error("There was an error fetching the menu data!", error);
      }
    };

    fetchMenuData();
  }, []);

  const handleUpdate = (menuItemId) => {
    console.log(`Update menu item with ID: ${menuItemId}`);
    navigate(`/update-menu/${menuItemId}`); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/menu/delete-menu-item/${id}`);
      setMenuData(menuData.filter(menuItem => menuItem._id !== id));
    } catch (error) {
      console.error("There was an error deleting the menu item!", error);
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

  const filteredMenu = menuData.filter(menuItem => {
    if (!searchQuery) return true;
    const field = menuItem[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedMenu = filteredMenu.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              Menu Items
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="menuItemName">Name</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="preparationTime">Preparation Time</MenuItem>
                  <MenuItem value="servingSize">Serving Size</MenuItem>
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
                  <TableCell style={{ color: 'white' }}>Image</TableCell>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Category</TableCell>
                  <TableCell style={{ color: 'white' }}>Price</TableCell>
                  <TableCell style={{ color: 'white' }}>Preparation Time</TableCell>
                  <TableCell style={{ color: 'white' }}>Serving Size</TableCell>
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMenu.map((menuItem) => (
                  <TableRow key={menuItem._id}>
                    <TableCell>
                      <img
                        src={menuItem.menuImage}
                        alt={menuItem.menuItemName}
                        style={{ width: '100px', height: '70px', borderRadius: 8 }}
                      />
                    </TableCell>
                    <TableCell>{menuItem.menuItemId}</TableCell>
                    <TableCell>{menuItem.menuItemName}</TableCell>
                    <TableCell>{menuItem.category}</TableCell>
                    <TableCell>Rs {menuItem.price}</TableCell>
                    <TableCell>{menuItem.preparationTime} mins</TableCell>
                    <TableCell>{menuItem.servingSize}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpdate(menuItem._id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(menuItem._id)}
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
            count={filteredMenu.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewMenu;
