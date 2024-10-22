import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, Paper } from '@material-ui/core';
import Header from '../../Components/guest_header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import UserImg from '../../Images/register.png';

const ManageProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState({
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
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3002/user/user/${id}`);
        const data = await response.json();
    
        // Ensure DOB is formatted as YYYY-MM-DD
        const formattedDOB = new Date(data.DOB).toISOString().slice(0, 10);
    
        setUser({
          title: data.title || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          address: data.address || '',
          NIC: data.NIC || '',
          DOB: formattedDOB, // Set formatted DOB here
          contact: data.contact || '',
          emailAddress: data.emailAddress || '',
          city: data.city || '',
          district: data.district || '',
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    

    if (id) {
      fetchUserInfo();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!user.firstName) newErrors.firstName = "First Name is required.";
    if (!user.lastName) newErrors.lastName = "Last Name is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Hambantota',
    'Matara',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Polonnaruwa',
    'Anuradhapura',
    'Kegalle',
    'Ratnapura',
    'Badulla',
    'Monaragala',
    'Embilipitiya',
    'Kurunegala',
    'Puttalam',
    'Gampaha',
    'Colombo'
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3002/user/user/${id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      swal("Success", "Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Box>
      <Header />
      <Box display="flex" justifyContent="center" p={2}   style={{
            backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")',
            backgroundSize: 'auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
        }}>
        <Paper elevation={3} style={{ padding: 20, width: '100%', maxWidth: 1000 }}>
        <Typography
              variant="h4"
              gutterBottom
              style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}
            >
              Manage Profile
        </Typography>
        <Box component="form" display="flex" justifyContent="space-between" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box width="60%">
              <InputLabel style={{marginLeft:'40px'}}>Title</InputLabel>
              <Select
                fullWidth
                label="title"
                name='title'
                value={user.title}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                style={{marginLeft:'40px'}}
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
                value={user.firstName}
                onChange={handleChange}
                helperText={errors.firstName}
                error={!!errors.firstName}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={user.lastName}
                onChange={handleChange}
                helperText={errors.lastName}
                error={!!errors.lastName}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                variant="outlined"
                value={user.address}
                onChange={handleChange}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="NIC"
                name="NIC"
                variant="outlined"
                value={user.NIC}
                onChange={handleChange}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Date of Birth"
                name="DOB"
                type="date"
                variant="outlined"
                value={user.DOB}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Contact"
                name="contact"
                variant="outlined"
                value={user.contact}
                onChange={handleChange}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="emailAddress"
                variant="outlined"
                value={user.emailAddress}
                onChange={handleChange}
                style={{marginLeft:'40px'}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="City"
                name="city"
                variant="outlined"
                value={user.city}
                onChange={handleChange}
                style={{marginLeft:'40px'}}
              />
                <InputLabel style={{marginLeft:'40px'}}>District</InputLabel>
                <Select
                fullWidth
                name="district"
                value={user.district}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                style={{ marginLeft: '40px' }}
                >
                {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                    {district}
                    </MenuItem>
                ))}
                </Select>
              <Button fullWidth type="submit" variant="contained" color="primary" style={{ marginTop: 20, marginLeft:'40px', marginBottom:'30px' }}>
                Update Profile
              </Button>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" width="35%" style={{ marginLeft: '20px' }}>
              <img
                src={UserImg}
                alt="Profile"
                style={{ maxWidth: '250px', borderRadius: '8px' }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ManageProfile;
