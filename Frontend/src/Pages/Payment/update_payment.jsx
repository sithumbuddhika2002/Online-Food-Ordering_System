import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdatePayment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    totalPrice: '',
    deliveryDistrict: '',
    deliveryId: '',
    cardType: 'Visa',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3002/payment/get-payment/${id}`)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load payment details');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.totalPrice || formData.totalPrice <= 0) newErrors.totalPrice = "Valid total price is required.";
    if (!formData.deliveryDistrict) newErrors.deliveryDistrict = "Delivery district is required.";
    if (!formData.deliveryId) newErrors.deliveryId = "Delivery ID is required.";
    if (!formData.cardNumber || formData.cardNumber.length !== 16) newErrors.cardNumber = "Valid 16-digit card number is required.";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required.";
    if (!formData.cvv || formData.cvv.length !== 3) newErrors.cvv = "Valid 3-digit CVV is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios.put(`http://localhost:3002/payment/update-payment/${id}`, formData)
      .then(() => {
        setSuccess(true);
        swal("Success", "Payment updated successfully!", "success");
        navigate('/view-payments');
      })
      .catch(() => {
        setError('Failed to update payment details');
        setSuccess(false);
        swal("Error", "Something went wrong. Please try again.", "error");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header />
      <Box display="flex">
        <Sidebar />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
            Update Payment Details
          </Typography>

          <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              helperText={errors.firstName}
              error={!!errors.firstName}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              helperText={errors.lastName}
              error={!!errors.lastName}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Total Price"
              variant="outlined"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              helperText={errors.totalPrice}
              error={!!errors.totalPrice}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Delivery District"
              variant="outlined"
              name="deliveryDistrict"
              value={formData.deliveryDistrict}
              onChange={handleChange}
              helperText={errors.deliveryDistrict}
              error={!!errors.deliveryDistrict}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Card Type</InputLabel>
              <Select
                name="cardType"
                value={formData.cardType}
                onChange={handleChange}
                label="Card Type"
              >
                <MenuItem value="Visa">Visa</MenuItem>
                <MenuItem value="MasterCard">MasterCard</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Card Number"
              variant="outlined"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              helperText={errors.cardNumber}
              error={!!errors.cardNumber}
              inputProps={{ maxLength: 16 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Expiry Date"
              variant="outlined"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              helperText={errors.expiryDate}
              error={!!errors.expiryDate}
            />
            <TextField
              fullWidth
              margin="normal"
              label="CVV"
              variant="outlined"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              helperText={errors.cvv}
              error={!!errors.cvv}
              inputProps={{ maxLength: 3 }}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              Update Payment
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdatePayment;
