import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateMenu = () => {
  const { id } = useParams(); // Extract ID from URL params
  const navigate = useNavigate();

  const [menuItemId, setMenuItemId] = useState('');
  const [menuItemName, setMenuItemName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [menuImage, setMenuImage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/menu/get-menu-item/${id}`);
        const { menuItemId, menuItemName, category, price, preparationTime, servingSize, menuImage } = response.data;
        setMenuItemId(menuItemId);
        setMenuItemName(menuItemName);
        setCategory(category);
        setPrice('Rs ' + price);
        setPreparationTime(preparationTime);
        setServingSize(servingSize);
        setMenuImage(menuImage);
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch menu item data.", "error");
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, category: '' }));
  };

  const handleMenuItemIdChange = (event) => {
    const value = event.target.value;
    setMenuItemId(value);
    setErrors(prevErrors => ({ ...prevErrors, menuItemId: '' }));
  };

  const handlePriceChange = (event) => {
    const value = event.target.value.replace(/^Rs\s*/, '');
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value ? 'Rs ' + value : '');
    }
    setErrors(prevErrors => ({ ...prevErrors, price: '' }));
  };

  const handlePreparationTimeChange = (event) => {
    setPreparationTime(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, preparationTime: '' }));
  };

  const handleServingSizeChange = (event) => {
    setServingSize(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, servingSize: '' }));
  };

  const handleMenuImageChange = (event) => {
    setMenuImage(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, menuImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!menuItemId) newErrors.menuItemId = "Menu Item ID is required.";
    if (!menuItemName) newErrors.menuItemName = "Menu Item Name is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!price || price === 'Rs ') newErrors.price = "Price is required.";
    if (!preparationTime) newErrors.preparationTime = "Preparation Time is required.";
    if (!servingSize) newErrors.servingSize = "Serving Size is required.";
    if (!menuImage) newErrors.menuImage = "Menu Image URL is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedMenuItem = {
      menuItemId,
      menuItemName,
      category,
      price: price.replace(/^Rs\s*/, ''),
      preparationTime,
      servingSize,
      menuImage,
    };

    try {
      await axios.put(`http://localhost:3002/menu/update-menu-item/${id}`, updatedMenuItem);
      swal("Success", "Menu item updated successfully!", "success");
      navigate('/view-menu');
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header />
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px', marginTop:'20px' }}
        >
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'50px'  }}>
              Update Menu Item
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
              <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Menu Item ID"
                  variant="outlined"
                  value={menuItemId}
                  onChange={handleMenuItemIdChange}
                  helperText={errors.menuItemId}
                  error={!!errors.menuItemId}
                  disabled
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Menu Item Name"
                  variant="outlined"
                  value={menuItemName}
                  onChange={(e) => setMenuItemName(e.target.value)}
                  helperText={errors.menuItemName}
                  error={!!errors.menuItemName}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    label="Category"
                  >
                    <MenuItem value="Appetizer">Appetizer</MenuItem>
                    <MenuItem value="Main Course">Main Course</MenuItem>
                    <MenuItem value="Dessert">Dessert</MenuItem>
                    <MenuItem value="Beverage">Beverage</MenuItem>
                  </Select>
                  <FormHelperText>{errors.category}</FormHelperText>
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Price"
                  variant="outlined"
                  value={price}
                  onChange={handlePriceChange}
                  helperText={errors.price}
                  error={!!errors.price}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.preparationTime}>
                  <InputLabel>Preparation Time (in minutes)</InputLabel>
                  <Select
                    value={preparationTime}
                    onChange={handlePreparationTimeChange}
                    label="Preparation Time (in minutes)"
                  >
                    <MenuItem value="5">5 minutes</MenuItem>
                    <MenuItem value="10">10 minutes</MenuItem>
                    <MenuItem value="15">15 minutes</MenuItem>
                    <MenuItem value="20">20 minutes</MenuItem>
                    <MenuItem value="25">25 minutes</MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                    <MenuItem value="35">35 minutes</MenuItem>
                    <MenuItem value="40">40 minutes</MenuItem>
                    <MenuItem value="45">45 minutes</MenuItem>
                    <MenuItem value="50">50 minutes</MenuItem>
                    <MenuItem value="55">55 minutes</MenuItem>
                    <MenuItem value="60">60 minutes</MenuItem>
                  </Select>
                  <FormHelperText>{errors.preparationTime}</FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.servingSize}>
                  <InputLabel>Serving Size</InputLabel>
                  <Select
                    value={servingSize}
                    onChange={handleServingSizeChange}
                    label="Serving Size"
                  >
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                  </Select>
                  <FormHelperText>{errors.servingSize}</FormHelperText>
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Menu Image URL"
                  variant="outlined"
                  value={menuImage}
                  onChange={handleMenuImageChange}
                  helperText={errors.menuImage}
                  error={!!errors.menuImage}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  Update Menu Item
                </Button>
              </Box>
            </Box>

            {/* Image Box */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
              {menuImage && (
                <img
                  src="https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?cs=srgb&dl=pexels-flodahm-541216.jpg&fm=jpg"
                  alt={menuItemName}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateMenu;
