import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import swal from 'sweetalert';
import InventoryImage from '../../Images/inventory.png';

  // Function to generate unique itemId
  const generateRandomItemId = () => {
    const randomId = Math.floor(Math.random() * 9000) + 1000; 
    return `INVE-${randomId}`; 
  };

const AddInventory = () => {
  const [inventoryData, setInventoryData] = useState({
    itemId: generateRandomItemId(),
    itemName: '',
    category: '',
    description: '',
    unitOfMeasure: '',
    quantityInStock: '',
    reorderLevel: '',
    reorderQuantity: '',
    supplierId: '',
    costPrice: '',
    lastRestockedDate: '',
    expirationDate: '',
    brand: '',
    locationInStore: '',
    stockStatus: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInventoryData({ ...inventoryData, [name]: value });
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'itemId', 'itemName', 'category', 'description', 'unitOfMeasure', 
      'quantityInStock', 'reorderLevel', 'reorderQuantity', 
      'supplierId', 'costPrice', 'stockStatus', 'brand', 
      'locationInStore', 'lastRestockedDate', 'expirationDate'
    ];
    
    requiredFields.forEach(field => {
      if (!inventoryData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required.`;
      }
    });
  
    // Add checks for negative values
    if (inventoryData.quantityInStock < 0) {
      newErrors.quantityInStock = 'Quantity in Stock cannot be negative.';
    }
    if (inventoryData.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder Level cannot be negative.';
    }
    if (inventoryData.reorderQuantity < 0) {
      newErrors.reorderQuantity = 'Reorder Quantity cannot be negative.';
    }
    if (parseFloat(inventoryData.costPrice.replace('Rs', '').trim()) < 0) {
      newErrors.costPrice = 'Cost Price cannot be negative.';
    }
  
    return newErrors;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:3002/inventory/add-inventory-item', inventoryData);
      swal("Success", "New inventory item added successfully!", "success");
      setInventoryData({
        itemId: generateRandomItemId(),
        itemName: '',
        category: '',
        description: '',
        unitOfMeasure: '',
        quantityInStock: '',
        reorderLevel: '',
        reorderQuantity: '',
        supplierId: '',
        costPrice: '',
        lastRestockedDate: '',
        expirationDate: '',
        brand: '',
        locationInStore: '',
        stockStatus: '',
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header />
      <Box 
        display="flex" 
        style={{ 
            backgroundColor:'black'
        }}
        >
        <Sidebar />
        <Box
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="space-between"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px',padding:'40px' }}
        >

          <Box component="form" width="70%" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'cursive',color: 'purple', textAlign: 'center', marginTop:'50px', marginBottom:'20px'}}>
                Add New Inventory Item
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              label="Item ID"
              variant="outlined"
              name="itemId"
              value={inventoryData.itemId}
              onChange={handleInputChange}
              helperText={errors.itemId}
              error={!!errors.itemId}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Item Name"
              variant="outlined"
              name="itemName"
              value={inventoryData.itemName}
              onChange={handleInputChange}
              helperText={errors.itemName}
              error={!!errors.itemName}
            />
        <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={inventoryData.category}
            onChange={handleInputChange}
            label="Category"
          >
            <MenuItem value="Vegetables">Vegetables</MenuItem>
            <MenuItem value="Fruits">Fruits</MenuItem>
            <MenuItem value="Meats">Meats</MenuItem>
            <MenuItem value="Seafood">Seafood</MenuItem>
            <MenuItem value="Dairy">Dairy</MenuItem>
            <MenuItem value="Beverages">Beverages</MenuItem>
            <MenuItem value="Grains">Grains</MenuItem>
            <MenuItem value="Spices and Herbs">Spices and Herbs</MenuItem>
            <MenuItem value="Bakery Products">Bakery Products</MenuItem>
            <MenuItem value="Condiments and Sauces">Condiments and Sauces</MenuItem>
            <MenuItem value="Snacks">Snacks</MenuItem>
            <MenuItem value="Frozen Foods">Frozen Foods</MenuItem>
            <MenuItem value="Canned Goods">Canned Goods</MenuItem>
            <MenuItem value="Packaging Materials">Packaging Materials</MenuItem>
            <MenuItem value="Cleaning Supplies">Cleaning Supplies</MenuItem>
          </Select>
          <FormHelperText>{errors.category}</FormHelperText>
        </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              variant="outlined"
              name="description"
              value={inventoryData.description}
              onChange={handleInputChange}
              helperText={errors.description}
              error={!!errors.description}
            />
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.unitOfMeasure}>
            <InputLabel>Unit of Measure</InputLabel>
            <Select
                name="unitOfMeasure"
                value={inventoryData.unitOfMeasure}
                onChange={handleInputChange}
                label="Unit of Measure"
            >
                <MenuItem value="Piece">Piece</MenuItem>
                <MenuItem value="Kilogram (kg)">Kilogram (kg)</MenuItem>
                <MenuItem value="Gram (g)">Gram (g)</MenuItem>
                <MenuItem value="Liter (L)">Liter (L)</MenuItem>
                <MenuItem value="Milliliter (mL)">Milliliter (mL)</MenuItem>
                <MenuItem value="Dozen">Dozen</MenuItem>
                <MenuItem value="Pack">Pack</MenuItem>
                <MenuItem value="Box">Box</MenuItem>
                <MenuItem value="Bag">Bag</MenuItem>
                <MenuItem value="Can">Can</MenuItem>
                <MenuItem value="Jar">Jar</MenuItem>
                <MenuItem value="Pound (lb)">Pound (lb)</MenuItem>
                <MenuItem value="Ounce (oz)">Ounce (oz)</MenuItem>
                <MenuItem value="Cup">Cup</MenuItem>
                <MenuItem value="Spoon">Spoon</MenuItem>
            </Select>
            <FormHelperText>{errors.unitOfMeasure}</FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Quantity in Stock"
              variant="outlined"
              name="quantityInStock"
              value={inventoryData.quantityInStock}
              onChange={handleInputChange}
              helperText={errors.quantityInStock}
              error={!!errors.quantityInStock}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0, // Set the minimum value here
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Reorder Level"
              variant="outlined"
              name="reorderLevel"
              value={inventoryData.reorderLevel}
              onChange={handleInputChange}
              helperText={errors.reorderLevel}
              error={!!errors.reorderLevel}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0, // Set the minimum value here
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Reorder Quantity"
              variant="outlined"
              name="reorderQuantity"
              value={inventoryData.reorderQuantity}
              onChange={handleInputChange}
              helperText={errors.reorderQuantity}
              error={!!errors.reorderQuantity}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0, // Set the minimum value here
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Supplier ID"
              variant="outlined"
              name="supplierId"
              value={inventoryData.supplierId}
              onChange={handleInputChange}
              helperText={errors.supplierId}
              error={!!errors.supplierId}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Cost Price"
              variant="outlined"
              name="costPrice"
              value={inventoryData.costPrice}
              onChange={handleInputChange}
              helperText={errors.costPrice}
              error={!!errors.costPrice}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0, // Set the minimum value here
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Restocked Date"
              variant="outlined"
              name="lastRestockedDate"
              type="date"
              value={inventoryData.lastRestockedDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText={errors.lastRestockedDate}
              error={!!errors.lastRestockedDate}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Expiration Date"
              variant="outlined"
              name="expirationDate"
              type="date"
              value={inventoryData.expirationDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText={errors.expirationDate}
              error={!!errors.expirationDate}
              InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}  // This restricts to today or future dates
            />
            <TextField
              fullWidth
              margin="normal"
              label="Brand"
              variant="outlined"
              name="brand"
              value={inventoryData.brand}
              onChange={handleInputChange}
              helperText={errors.brand}
              error={!!errors.brand}
            />
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.locationInStore}>
            <InputLabel>Location in Store</InputLabel>
            <Select
                label="Location in Store"
                name="locationInStore"
                value={inventoryData.locationInStore}
                onChange={handleInputChange}
            >
                <MenuItem value="Kaduwela">Kaduwela</MenuItem>
                <MenuItem value="Malabe">Malabe</MenuItem>
                <MenuItem value="Kiribathgoda">Kiribathgoda</MenuItem>
                <MenuItem value="Kadawatha">Kadawatha</MenuItem>
                <MenuItem value="Ja-Ela">Ja-Ela</MenuItem>
            </Select>
            <FormHelperText>{errors.locationInStore}</FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.stockStatus}>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={inventoryData.stockStatus}
                onChange={handleInputChange}
                label="Stock Status"
                name="stockStatus"
              >
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
              </Select>
              <FormHelperText>{errors.stockStatus}</FormHelperText>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 44 }}
            >
              Add Inventory Item
            </Button>
          </Box>
        {/* Image Section */}
         <Box
            width="35%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop='110px'
            p={2}
          >
            <img
              src={InventoryImage}
              alt="Inventory"
              style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddInventory;
