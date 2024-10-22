import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import InventoryImage from '../../Images/inventory.png';

const UpdateInventory = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [quantityInStock, setQuantityInStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [reorderQuantity, setReorderQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [lastRestockedDate, setLastRestockedDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [brand, setBrand] = useState('');
  const [locationInStore, setLocationInStore] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/inventory/get-inventory-item/${id}`);
        const { itemId, itemName, category, description, unitOfMeasure, quantityInStock, reorderLevel, reorderQuantity, supplierId, costPrice, dateAdded, lastRestockedDate, expirationDate, brand, locationInStore, stockStatus } = response.data;
        setItemId(itemId);
        setItemName(itemName);
        setCategory(category);
        setDescription(description);
        setUnitOfMeasure(unitOfMeasure);
        setQuantityInStock(quantityInStock);
        setReorderLevel(reorderLevel);
        setReorderQuantity(reorderQuantity);
        setSupplierId(supplierId);
        setCostPrice(costPrice);
        setDateAdded(dateAdded ? new Date(dateAdded).toISOString().substring(0, 10) : '');
        setLastRestockedDate(lastRestockedDate ? new Date(lastRestockedDate).toISOString().substring(0, 10) : '');
        setExpirationDate(expirationDate ? new Date(expirationDate).toISOString().substring(0, 10) : '');
        setBrand(brand);
        setLocationInStore(locationInStore);
        setStockStatus(stockStatus);
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch inventory item data.", "error");
      }
    };

    fetchInventoryItem();
  }, [id]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, category: '' }));
  };

  const handleUnitOfMeasureChange = (event) => {
    setUnitOfMeasure(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, unitOfMeasure: '' }));
  };

  const handleLocationInStoreChange = (event) => {
    setLocationInStore(event.target.value);
  };
  
  const handleStockStatusChange = (event) => {
    setStockStatus(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, stockStatus: '' }));
  };

  const handlePriceChange = (event) => {
    const value = event.target.value.replace(/^Rs\s*/, ''); 
    if (/^\d*\.?\d*$/.test(value)) { 
      setCostPrice(value); 
    }
    setErrors(prevErrors => ({ ...prevErrors, costPrice: '' }));
  };
  

  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemId) newErrors.itemId = "Item ID is required.";
    if (!itemName) newErrors.itemName = "Item Name is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!unitOfMeasure) newErrors.unitOfMeasure = "Unit of Measure is required.";
    if (quantityInStock === '') newErrors.quantityInStock = "Quantity in Stock is required.";
    if (reorderLevel === '') newErrors.reorderLevel = "Reorder Level is required.";
    if (reorderQuantity === '') newErrors.reorderQuantity = "Reorder Quantity is required.";
    if (!supplierId) newErrors.supplierId = "Supplier ID is required.";
    if (!costPrice || costPrice === 'Rs ') newErrors.costPrice = "Cost Price is required.";
    if (!dateAdded) newErrors.dateAdded = "Date Added is required.";
    if (!stockStatus) newErrors.stockStatus = "Stock Status is required.";
    if (!brand) newErrors.brand = "Brand is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedInventoryItem = {
      itemId,
      itemName,
      category,
      description,
      unitOfMeasure,
      quantityInStock,
      reorderLevel,
      reorderQuantity,
      supplierId,
      costPrice,
      dateAdded,
      lastRestockedDate,
      expirationDate,
      brand,
      locationInStore,
      stockStatus,
    };

    try {
      await axios.put(`http://localhost:3002/inventory/update-inventory-item/${id}`, updatedInventoryItem);
      swal("Success", "Inventory item updated successfully!", "success");
      navigate('/view-inventory');
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
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="space-between"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          <Box alignItems="center" justifyContent="center">
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'cursive',color: 'purple', textAlign: 'center', marginTop:'50px', marginLeft:'40px'}}>
                Update Inventory Item
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            <Box
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
              <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Item ID"
                  variant="outlined"
                  value={itemId}
                  disabled
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Item Name"
                  variant="outlined"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  helperText={errors.itemName}
                  error={!!errors.itemName}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  helperText={errors.description}
                  error={!!errors.description}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.unitOfMeasure}>
                <InputLabel>Unit of Measure</InputLabel>
                <Select
                    name="unitOfMeasure"
                    value={unitOfMeasure}
                    onChange={handleUnitOfMeasureChange}
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
                  type="number"
                  value={quantityInStock}
                  onChange={(e) => setQuantityInStock(e.target.value)}
                  helperText={errors.quantityInStock}
                  error={!!errors.quantityInStock}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Reorder Level"
                  variant="outlined"
                  type="number"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  helperText={errors.reorderLevel}
                  error={!!errors.reorderLevel}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Reorder Quantity"
                  variant="outlined"
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(e.target.value)}
                  helperText={errors.reorderQuantity}
                  error={!!errors.reorderQuantity}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Supplier ID"
                  variant="outlined"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  helperText={errors.supplierId}
                  error={!!errors.supplierId}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Cost Price (Rs)"
                  variant="outlined"
                  value={costPrice}
                  onChange={handlePriceChange}
                  helperText={errors.costPrice}
                  error={!!errors.costPrice}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Date Added"
                  type="date"
                  variant="outlined"
                  value={dateAdded}
                  onChange={handleDateChange(setDateAdded)}
                  InputLabelProps={{ shrink: true }}
                  helperText={errors.dateAdded}
                  error={!!errors.dateAdded}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Restocked Date"
                  type="date"
                  variant="outlined"
                  value={lastRestockedDate}
                  onChange={handleDateChange(setLastRestockedDate)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Expiration Date"
                  type="date"
                  variant="outlined"
                  value={expirationDate}
                  onChange={handleDateChange(setExpirationDate)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Brand"
                  variant="outlined"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  helperText={errors.brand}
                  error={!!errors.brand}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.locationInStore}>
                <InputLabel>Location in Store</InputLabel>
                <Select
                    name="locationInStore"
                    value={locationInStore}
                    onChange={handleLocationInStoreChange}
                    label="Location in Store"
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
                    value={stockStatus}
                    onChange={handleStockStatusChange}
                    label="Stock Status"
                  >
                    <MenuItem value="In Stock">In Stock</MenuItem>
                    <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                    <MenuItem value="Low Stock">Low Stock</MenuItem>
                  </Select>
                  <FormHelperText>{errors.stockStatus}</FormHelperText>
                </FormControl>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                >
                  Update Inventory
                </Button>
              </Box>
            </Box>
                    {/* Image Section */}
         <Box
            width="32%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={2}
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
    </Box>
  );
};

export default UpdateInventory;
