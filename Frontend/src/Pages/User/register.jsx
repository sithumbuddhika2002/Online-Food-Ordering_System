import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, MenuItem, Select, InputLabel } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/guest_header'; 
import RegisterImage from '../../../src/Images/register.png';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    address: '',
    NIC: '',
    DOB: '',
    contact: '+94 ',
    emailAddress: '',
    city: '',
    district: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [contact, setContact] = useState('+94');
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contactRegex = /^\+94\d{9}$/;

  const validateField = (name, value) => {
    let fieldErrors = {};

    if (name === 'emailAddress' && value && !emailRegex.test(value)) {
      fieldErrors.emailAddress = 'Invalid email format.';
    }

    if (name === 'contact' && value.replace(/\s+/g, '') && !contactRegex.test(value.replace(/\s+/g, ''))) {
      fieldErrors.contact = 'Contact number must start with +94 and contain exactly 9 digits after it.';
    }

    if (name === 'NIC') {
      const nicValue = value.trim();
      const nicRegex = /^(\d{9}[vV]|\d{12})$/;
      if (nicValue && !nicRegex.test(nicValue)) {
        fieldErrors.NIC = 'NIC must be in the format 961234567v or 199612340567.';
      }
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{10,}$/;
      if (value && !passwordRegex.test(value)) {
        fieldErrors.password = 'Password must be at least 10 characters long and contain uppercase letters, lowercase letters, and numbers.';
      }
    }

    if (name === 'confirmPassword' && value !== formData.password) {
      fieldErrors.confirmPassword = 'Passwords do not match.';
    }

    if (name === 'DOB') {
      const DOB = new Date(value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - DOB.getFullYear();
      const isUnder18 = age < 18 || (age === 18 && currentDate < new Date(currentDate.getFullYear(), DOB.getMonth(), DOB.getDate()));
      const isOver80 = age > 80 || (age === 80 && currentDate > new Date(currentDate.getFullYear(), DOB.getMonth(), DOB.getDate()));

      if (isUnder18) {
        fieldErrors.DOB = 'You must be at least 18 years old.';
      } else if (isOver80) {
        fieldErrors.DOB = 'You must be under 80 years old.';
      }
    }

    return fieldErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Validate the changed field
    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] || '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required.`;
      }
    });

    // Validate the entire form after field updates
    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });

    return newErrors;
  };

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
    'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Polonnaruwa', 'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Kegalle', 'Badulla', 'Monaragala', 'Puttalam', 'Gampaha'
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:3002/user/register', formData);
      Swal.fire('Success', 'Registration successful!', 'success');

      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        address: '',
        NIC: '',
        DOB: '',
        contact: '',
        emailAddress: '',
        city: '',
        district: '',
        password: '',
        confirmPassword: '',
      });

      setErrors({});
      navigate('/login');

    } catch (error) {
      console.error(error);

      if (error.response && error.response.data.message === "User with this email or NIC already exists.") {
        Swal.fire({
          title: 'Error!',
          text: 'User with this email or NIC already exists.',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
        });
      }
    }
  };


  useEffect(() => {
    setContact('+94');
  }, []);

  return (
    <>
      <Navbar />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ 
          backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")', 
          backgroundSize: 'auto',}}
      >
        <Box
          display="flex"
          flexDirection="row"
          width="80%"
          p={2}
          mt={3}
          mb={3}
          borderRadius={8}
          boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
          style={{ backgroundColor: 'white' }}
        >
          {/* Form Fields */}
          <Box flex={2} pr={4}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}
            >
              Register
            </Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} style={{marginLeft:'40px'}}>
              {/* Form Fields */}
              <InputLabel>Title</InputLabel>
              <Select
                fullWidth
                label="title"
                name='title'
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              >
                {['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'].map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="firstName"
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                helperText={errors.firstName}
                error={!!errors.firstName}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
                helperText={errors.lastName}
                error={!!errors.lastName}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                variant="outlined"
                value={formData.address}
                onChange={handleChange}
                helperText={errors.address}
                error={!!errors.address}
              />

<TextField
  fullWidth
  margin="normal"
  label="NIC"
  name="NIC"
  variant="outlined"
  value={formData.NIC}
  onChange={(e) => {
    const nicValue = e.target.value.toUpperCase(); // Convert to uppercase for "v"
    if (/^\d{0,9}[vV]?$/.test(nicValue) || /^\d{0,12}$/.test(nicValue)) {
      setFormData({ ...formData, NIC: nicValue });
    }
  }}
  inputProps={{
    maxLength: formData.NIC.length <= 9 ? 10 : 12, // Allow max 10 for 9 digits + v or 12 digits
  }}
  helperText={errors.NIC}
  error={!!errors.NIC}
/>

<TextField
  fullWidth
  margin="normal"
  label="Date of Birth"
  name="DOB"
  type="date"
  variant="outlined"
  value={formData.DOB}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0],
    min: new Date(new Date().setFullYear(new Date().getFullYear() - 80)).toISOString().split('T')[0],

  }}
  helperText={errors.DOB}
  error={!!errors.DOB}
/>


<TextField
  fullWidth
  margin="normal"
  label="Contact"
  name="contact"
  variant="outlined"
  value={formData.contact}
  onChange={(e) => {
    const contactValue = e.target.value.replace(/\s+/g, ''); // Remove any whitespace
    if (/^\+94\d{0,9}$/.test(contactValue)) {
      setFormData({ ...formData, contact: contactValue });
    }
  }}
  inputProps={{
    maxLength: 12, // +94 and exactly 9 digits
  }}
  helperText={errors.contact}
  error={!!errors.contact}
/>

              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="emailAddress"
                variant="outlined"
                value={formData.emailAddress}
                onChange={handleChange}
                helperText={errors.emailAddress}
                error={!!errors.emailAddress}
              />

              <TextField
                fullWidth
                margin="normal"
                label="City"
                name="city"
                variant="outlined"
                value={formData.city}
                onChange={handleChange}
                helperText={errors.city}
                error={!!errors.city}
              />

              <TextField
                fullWidth
                select
                margin="normal"
                label="District"
                name="district"
                variant="outlined"
                value={formData.district}
                onChange={handleChange}
                helperText={errors.district}
                error={!!errors.district}
              >
                {districts.map((district, index) => (
                  <MenuItem key={index} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                helperText={errors.password}
                error={!!errors.password}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                helperText={errors.confirmPassword}
                error={!!errors.confirmPassword}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '16px' }}
              >
                Register
              </Button>
              {/* Login Link */}
              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Already created an account?{' '}
                  <Link to="/login" style={{ color: 'blue', textDecoration: 'none' }}>
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <img
              src={RegisterImage} 
              alt="Placeholder"
              style={{
                maxWidth: '100%',
                height: '90%',
                borderRadius: 8,
                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                marginRight:'40px'
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RegisterForm;
