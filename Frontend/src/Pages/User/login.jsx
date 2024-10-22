import React, { useState } from 'react';
import { Typography, TextField, Button, Box, CircularProgress, Link, Grid } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Components/guest_header'; 
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Email is invalid.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
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
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3002/user/login', formData);
  
      Swal.fire('Success', 'Login successful!', 'success');
  
      // Save the token to local storage
      localStorage.setItem('token', response.data.token);
  
      // Check if the response contains admin-specific redirect or role
      if (response.data.redirect === '/admin' || response.data.user?.role === 'admin') {
        navigate('/view-users');
      } else {
        navigate('/menu');
      }
  
      setFormData({
        emailAddress: '',
        password: '',
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Invalid email or password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Navbar />
      <Box
        style={{
          backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")', // Replace with your actual background image URL
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Form Section */}
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            width: '70%',
            height: '400px' 
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}
                >
                  Login
                </Typography>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="emailAddress"
                  variant="outlined"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  helperText={errors.emailAddress}
                  error={!!errors.emailAddress}
                  autoComplete="emailAddress"
                  style={{ marginLeft: '20px' }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  name="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  helperText={errors.password}
                  error={!!errors.password}
                  autoComplete="current-password"
                  style={{ marginLeft: '20px' }}
                />

                {/* Forgot Password Link */}
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Link href="/forgot-password" variant="body2" color="primary">
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  style={{ marginTop: 16, marginLeft: '20px' }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>

                {/* Don't have an account? Sign Up */}
                <Box display="flex" justifyContent="center" mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Not have an account?{' '}
                    <Link href="/register" variant="body2" color="primary">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Image Grid */}
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <img
                  src="https://img.freepik.com/premium-photo/luxury-hotel-five-star-room-service-various-food-platters-bread-coffee-as-inroom-breakfast-travel-hospitality_360074-42718.jpg" // Replace with actual image URL
                  alt="Login Illustration"
                  style={{ maxWidth: '90%', height: 'auto', borderRadius: '8px' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;
