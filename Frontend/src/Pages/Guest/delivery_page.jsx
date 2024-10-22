import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, MenuItem, Select, FormControl, InputLabel, Paper  } from '@material-ui/core';
import Header from '../../Components/guest_header';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate, useLocation } from 'react-router-dom';

const DeliveryForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [deliveryDistrict, setDeliveryDistrict] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState('');
  const [initialTotalPrice, setInitialTotalPrice] = useState(''); 
  const [shippingPrice, setShippingPrice] = useState(0); 
  const [subtotal, setSubtotal] = useState(0); 
  const [_id, set_id] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const districtShippingPrices = {
    'Colombo': 100,
    'Gampaha': 150,
    'Kalutara': 120,
    'Kandy': 200,
    'Matale': 180,
    'Nuwara Eliya': 250,
    'Galle': 220,
    'Hambantota': 240,
    'Matara': 210,
    'Jaffna': 300,
    'Kilinochchi': 320,
    'Mannar': 290,
    'Vavuniya': 260,
    'Mullaitivu': 310,
    'Batticaloa': 240,
    'Ampara': 230,
    'Trincomalee': 250,
    'Polonnaruwa': 220,
    'Anuradhapura': 270,
    'Kegalle': 190,
    'Ratnapura': 200,
    'Badulla': 210,
    'Monaragala': 230,
    'Embilipitiya': 180,
    'Kurunegala': 160,
    'Puttalam': 170,
  };
   

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
    'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Polonnaruwa', 'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Kegalle', 'Badulla', 'Monaragala', 'Puttalam', 'Gampaha'
  ];

  const validateForm = () => {
    let newErrors = {};
    if (!firstName) newErrors.firstName = "First Name is required.";
    if (!lastName) newErrors.lastName = "Last Name is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!deliveryDistrict) newErrors.deliveryDistrict = "Delivery District is required.";
    if (!deliveryDate) newErrors.deliveryDate = "Delivery Date is required.";
    if (!phone || !/^(\+94\s?)?\d{9,10}$/.test(phone)) newErrors.phone = "Phone Number must start with +94 and be followed by 9 digits.";
    if (!whatsappNo || !/^(\+94\s?)?\d{9,10}$/.test(whatsappNo)) newErrors.whatsappNo = "WhatsApp Number must start with +94 and be followed by 9 digits.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
      if (!emailRegex.test(email)) {
        newErrors.email = "Email is not valid.";
      }
    }
    if (isNaN(parseFloat(totalPrice)) || parseFloat(totalPrice) <= 0) newErrors.totalPrice = "Total Price must be a positive number.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const newDelivery = {
      firstName,
      lastName,
      address,
      city,
      deliveryDistrict,
      deliveryDate,
      phone,
      email,
      whatsappNo,
      orderNotes,
      orderedItems,
      totalPrice: parseFloat(initialTotalPrice) + shippingPrice,
    };
    
    try {
      const response = await axios.post('http://localhost:3002/delivery/add-delivery', newDelivery);
      const createdDelivery = response.data; 
      swal("Success", "Delivery details added successfully!", "success");
  
      // Pass the relevant details to the payment page
      const paymentDetails = {
        deliveryId: createdDelivery.deliveryId, 
        firstName,
        lastName,
        deliveryDistrict,
        totalPrice: parseFloat(initialTotalPrice),
        email
      };
  
      navigate('/payment-page', { state: { paymentDetails } });
  
      setFirstName('');
      setLastName('');
      setAddress('');
      setCity('');
      setDeliveryDistrict('');
      setDeliveryDate('');
      setPhone('');
      setEmail('');
      setWhatsappNo('');
      setOrderNotes('');
      setOrderedItems([]);
      setTotalPrice('');
      setInitialTotalPrice(''); 
      setShippingPrice(0);
      setSubtotal(0);
    } catch (error) {
      console.error('Delivery submission error:', error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {  
    if (location.state) {
      setOrderedItems(location.state.orderedItems || []);
      setInitialTotalPrice(location.state.totalPrice || ''); 
    }
  }, [location.state]);

  useEffect(() => {
    // Update shipping price when delivery district changes
    if (districtShippingPrices[deliveryDistrict] !== undefined) {
      setShippingPrice(districtShippingPrices[deliveryDistrict]);
    } else {
      setShippingPrice(0); 
    }
  }, [deliveryDistrict]);

  useEffect(() => {
    // Update total price whenever initialTotalPrice or shippingPrice changes
    setTotalPrice(parseFloat(initialTotalPrice) + shippingPrice);
  }, [initialTotalPrice, shippingPrice]);

  useEffect(() => {
    // Update subtotal based on ordered items
    const newSubtotal = orderedItems.reduce((acc, item) => acc + (item.itemPrice * item.itemQuantity), 0);
    setSubtotal(newSubtotal);
  }, [orderedItems]);

  useEffect(() => {
    // Set the delivery date as tomorrow's date when the component is mounted
    setDeliveryDate(getTomorrowDate());
  }, []);

  // Function to get tomorrow's date in 'YYYY-MM-DD' format
const getTomorrowDate = () => {
  const today = new Date();
  
  // Format the date as 'YYYY-MM-DD'
  return today.toISOString().split('T')[0];
};

  // Handle input changes and clear corresponding errors
  const handleInputChange = (setter, errorKey) => (e) => {
    setter(e.target.value);
    if (errors[errorKey]) {
      setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: undefined }));
    }
  };


  return (
    <Box style={{ backgroundColor: 'black', minHeight: '100vh', color: 'black' }}>
      <Header />
      <Box display="flex">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            flex: 1,
            margin: '15px',
            padding: '20px',
          }}
        >
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: 'black', marginTop: '30px' }}>
              Add Delivery Details
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
                  label="First Name"
                  variant="outlined"
                  value={firstName}
                  onChange={handleInputChange(setFirstName, 'firstName')}
                  helperText={errors.firstName}
                  error={!!errors.firstName}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Name"
                  variant="outlined"
                  value={lastName}
                  onChange={handleInputChange(setLastName, 'lastName')}
                  helperText={errors.lastName}
                  error={!!errors.lastName}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address"
                  variant="outlined"
                  value={address}
                  onChange={handleInputChange(setAddress, 'address')}
                  helperText={errors.address}
                  error={!!errors.address}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="City"
                  variant="outlined"
                  value={city}
                  onChange={handleInputChange(setCity, 'city')}
                  helperText={errors.city}
                  error={!!errors.city}
                  required
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Delivery District</InputLabel>
                  <Select
                    value={deliveryDistrict}
                    onChange={(e) => {
                      handleInputChange(setDeliveryDistrict, 'deliveryDistrict')(e);
                    }}
                    label="Delivery District"
                    error={!!errors.deliveryDistrict}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.deliveryDistrict && <Typography variant="caption" style={{marginLeft:'15px'}} color="error">{errors.deliveryDistrict}</Typography>}
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  type="date"
                  variant="outlined"
                  value={deliveryDate}
                  label="Delivery Date"
                  onChange={handleInputChange(setDeliveryDate, 'deliveryDate')}
                  InputProps={{ inputProps: { min: getTomorrowDate() } }}
                  error={!!errors.deliveryDate}
                  helperText={errors.deliveryDate}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Phone Number"
                  type="tel"
                  variant="outlined"
                  value={phone}
                  onChange={handleInputChange(setPhone, 'phone')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+94</InputAdornment>,
                  }}
                  helperText={errors.phone}
                  error={!!errors.phone}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={handleInputChange(setEmail, 'email')}
                  helperText={errors.email}
                  error={!!errors.email}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="WhatsApp Number"
                  type="tel"
                  variant="outlined"
                  value={whatsappNo}
                  onChange={handleInputChange(setWhatsappNo, 'whatsappNo')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+94</InputAdornment>,
                  }}
                  helperText={errors.whatsappNo}
                  error={!!errors.whatsappNo}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Order Notes"
                  variant="outlined"
                  value={orderNotes}
                  onChange={handleInputChange(setOrderNotes, 'orderNotes')}
                  multiline={true}
                  rows={5}
                />
                <Box textAlign="center" mt={2} >
                  <Button variant="contained" color="primary" type="submit" fullWidth >
                    Proceed to Payment
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              style={{ flex: 1 }}
            >
            <Box
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              style={{ flex: 1}}
            >

          {/* Order Summary Section */}
          <Box
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            marginTop='40px'
            marginBottom='40px'
            style={{ flex: 1}}
          >
            <Typography variant="h6" gutterBottom style={{fontWeight:600}}>
              Order Summary
            </Typography>
            <Paper style={{ padding: '25px', borderRadius: '8px', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)', backgroundColor:'cyan' }}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold'}}>
                  Product
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  Subtotal
                </Typography>
              </Box>

              {/* Ordered Items */}
              {orderedItems.map((item, index) => (
                <Box display="flex" justifyContent="space-between" mb={1} key={index}>
                  <Typography variant="body1">
                    {item.itemName} × {item.quantity}
                  </Typography>
                  <Typography variant="body1">₨ {item.price}</Typography>
                </Box>
              ))}
              <hr></hr>
              {/* Subtotal */}
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  Subtotal
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  ₨ {initialTotalPrice}
                </Typography>
              </Box>
              <hr></hr>
              {/* Shipping */}
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="subtitle1">
                  Shipping
                </Typography>
                <Typography variant="subtitle1">
                  Rs {shippingPrice}
                </Typography>
              </Box>
              <hr></hr>
              {/* Total */}
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  ₨ {totalPrice}
                </Typography>
              </Box>
            </Paper>

            <Box mt={2}>
              <Typography variant="body2">
                Pay with your card via Mastercard Payment Gateway Services
              </Typography>
            </Box>
          </Box>
            </Box>
              <Typography variant="h6" gutterBottom style={{ color: 'black', fontWeight:'600' }}>
                Additional Information
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px',  }}>
                1. Please make sure to review your delivery details carefully before submitting.
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px' }}>
                2. Ensure all contact information is accurate to avoid delays.
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px' }}>
                3. If you have any special instructions for delivery, please include them in the Order Notes section.
              </Typography>

              <Typography variant="h6" gutterBottom style={{ color: 'black', marginTop: '20px',  fontWeight:'600' }}>
                For Colombo District Orders
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px' }}>
                1. Please place your lunch orders between 8.00am to 9.00am to get the order after 12.00pm.
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px' }}>
                2. All orders placed after 9.00am will be delivered after 6 hours. (Order time slot should be opened after 6.00hrs from the time of order)
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px' }}>
                3. All orders will be closed after 4.00pm for same-day deliveries. Orders placed after 4.00pm will be delivered the following day.
              </Typography>

              <Typography variant="h6" gutterBottom style={{ color: 'black', marginTop: '20px',  fontWeight:'600' }}>
                For Other District Orders
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom: '10px' }}>
                1. Please place your orders at least 2 days in advance.
              </Typography>
              <Typography variant="body1" style={{ color: 'black', marginBottom:'50px' }}>
                2. No cash on delivery option for all orders.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryForm;
