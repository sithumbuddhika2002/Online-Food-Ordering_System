import React, { useState } from 'react';
import { Typography, TextField, Button, Box, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Components/guest_header';

const ForgotPasswordForm = () => {
  const [emailAddress, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!emailAddress) {
      return 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      return 'Email is invalid.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3002/user/forgot-password', { emailAddress });
      Swal.fire('Success', 'A password reset link has been sent to your email.', 'success');

      // Clear the form
      setEmail('');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Error sending password reset link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Include Navbar */}
      <Navbar />

      {/* Background Image */}
      <Box
        sx={{
          backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")', // Replace with your actual background image URL
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Forgot Password Form */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            width: '80%',
          }}
        >
          {/* Form Fields */}
          <Box flex={2} p={2}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}
            >
              Forgot Password
            </Typography>

            <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="emailAddress"
                variant="outlined"
                value={emailAddress}
                onChange={handleChange}
                helperText={error}
                error={!!error}
                autoComplete="emailAddress"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                style={{ marginTop: 16 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
            </Box>
          </Box>

          {/* Image Section */}
          <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <img
              src="https://www.adobe.com/content/dam/cc/us/en/creative-cloud/photography/discover/food-photography/CODERED_B1_food-photography_p4b_690x455.jpg.img.jpg" // Replace with your image link
              alt="Forgot Password"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPasswordForm;
