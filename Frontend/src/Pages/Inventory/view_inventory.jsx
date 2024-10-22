import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

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

const ViewInventory = () => {
  const classes = useStyles();
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("itemName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/inventory/get-inventory-items');
        setInventoryData(response.data);
      } catch (error) {
        console.error("There was an error fetching the inventory data!", error);
      }
    };

    fetchInventoryData();
  }, []);

  const handleUpdate = (itemId) => {
    console.log(`Update item with ID: ${itemId}`);
    navigate(`/update-inventory/${itemId}`); // Navigate to the update page with the item ID
  };

  const handleDelete = async (id) => {
    try {
      // Delete the item
      await axios.delete(`http://localhost:3002/inventory/delete-inventory-item/${id}`);
      
      // Refetch the updated inventory data
      const response = await axios.get('http://localhost:3002/inventory/get-inventory-items');
      setInventoryData(response.data);
    } catch (error) {
      console.error("There was an error deleting the inventory item!", error);
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

  const filteredInventory = inventoryData.filter(item => {
    if (!searchQuery) return true;
    const field = item[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedInventory = filteredInventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Inventory Overview
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="itemId">Item ID</MenuItem>
                  <MenuItem value="itemName">Item Name</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="unitOfMeasure">Unit Of Measure</MenuItem>
                  <MenuItem value="quantityInStock">Quantity In Stock</MenuItem>
                  <MenuItem value="reorderLevel">Reorder Level</MenuItem>
                  <MenuItem value="reorderQuantity">Reorder Quantity</MenuItem>
                  <MenuItem value="supplierId">Supplier ID</MenuItem>
                  <MenuItem value="costPrice">Cost Price</MenuItem>
                  <MenuItem value="dateAdded">Date Added</MenuItem>
                  <MenuItem value="lastRestockedDate">Last Restocked Date</MenuItem>
                  <MenuItem value="expirationDate">Expiration Date</MenuItem>
                  <MenuItem value="brand">Brand</MenuItem>
                  <MenuItem value="locationInStore">Location In Store</MenuItem>
                  <MenuItem value="stockStatus">Stock Status</MenuItem>
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
                  <TableCell style={{ color: 'white' }}>Item ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Item Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Category</TableCell>
                  <TableCell style={{ color: 'white' }}>Description</TableCell>
                  <TableCell style={{ color: 'white' }}>Unit Of Measure</TableCell>
                  <TableCell style={{ color: 'white' }}>Quantity In Stock</TableCell>
                  <TableCell style={{ color: 'white' }}>Reorder Level</TableCell>
                  <TableCell style={{ color: 'white' }}>Reorder Quantity</TableCell>
                  <TableCell style={{ color: 'white' }}>Supplier ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Cost Price</TableCell>
                  <TableCell style={{ color: 'white' }}>Date Added</TableCell>
                  <TableCell style={{ color: 'white' }}>Last Restocked Date</TableCell>
                  <TableCell style={{ color: 'white' }}>Expiration Date</TableCell>
                  <TableCell style={{ color: 'white' }}>Brand</TableCell>
                  <TableCell style={{ color: 'white' }}>Location In Store</TableCell>
                  <TableCell style={{ color: 'white' }}>Stock Status</TableCell>
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell>{item.itemId}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unitOfMeasure}</TableCell>
                    <TableCell>{item.quantityInStock}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>{item.reorderQuantity}</TableCell>
                    <TableCell>{item.supplierId}</TableCell>
                    <TableCell>Rs {item.costPrice}</TableCell>
                    <TableCell>{new Date(item.dateAdded).toLocaleDateString()}</TableCell>
                    <TableCell>{item.lastRestockedDate ? new Date(item.lastRestockedDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.locationInStore}</TableCell>
                    <TableCell
                        style={{
                            color: item.stockStatus === 'In Stock' ? 'blue' :
                                item.stockStatus === 'Low Stock' ? 'green' :
                                item.stockStatus === 'Out of Stock' ? 'red' : 'black'
                        }}
                        >
                        {item.stockStatus}
                    </TableCell>

                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleUpdate(item._id)}>
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(item._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CustomPagination
              count={filteredInventory.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
            />
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewInventory;
