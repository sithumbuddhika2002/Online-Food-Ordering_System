import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControl, Select, InputLabel, MenuItem, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [nic, setNIC] = useState('');
  const [dob, setDOB] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/user/user/${id}`);
        const { title, firstName, lastName, address, NIC, DOB, contact, emailAddress, city, district } = response.data;
        setTitle(title);
        setFirstName(firstName);
        setLastName(lastName);
        setAddress(address);
        setNIC(NIC);
        setDOB(DOB.slice(0, 10)); 
        setContact(contact)
        setEmail(emailAddress);
        setCity(city);
        setDistrict(district);
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch user data.", "error");
      }
    };

    fetchUser();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
  
    // Title validation
    if (!title) newErrors.title = "Title is required.";
  
    // First Name validation
    if (!firstName) {
      newErrors.firstName = "First Name is required.";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters long.";
    }
  
    // Last Name validation
    if (!lastName) {
      newErrors.lastName = "Last Name is required.";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters long.";
    }
  
    // Address validation
    if (!address) newErrors.address = "Address is required.";
  
    // NIC validation
    if (!nic) {
      newErrors.nic = "NIC is required.";
    } else if (!/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(nic)) {
      newErrors.nic = "NIC format is invalid (e.g., 123456789V or 123456789012).";
    }

  
    // Date of Birth validation
    if (!dob) {
      newErrors.dob = "Date of Birth is required.";
    } else {
      const birthDate = new Date(dob);
      if (isNaN(birthDate.getTime())) {
        newErrors.dob = "Invalid Date of Birth.";
      } else {
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();

        // Adjust age if birth month/day hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18) {
          newErrors.dob = "User must be at least 18 years old.";
        } else if (age > 80) {
          newErrors.dob = "User must be less than 80 years old.";
        }
      }
    }


    // Contact validation
    if (!contact) {
      newErrors.contact = "Contact is required.";
    } else if (!/^\+94\s[0-9]{9}$/.test(contact)) {
      newErrors.contact = "Contact must be in the format +94 XXXXXXXXX.";
    }
  
    // Email validation
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid.";
    }
  
    // City validation
    if (!city) newErrors.city = "City is required.";
  
    // District validation
    if (!district) newErrors.district = "District is required.";
  
    return newErrors;
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

    const updatedUser = {
      title,
      firstName,
      lastName,
      address,
      NIC: nic,
      DOB: dob,
      contact,
      emailAddress: email,
      city,
      district,
      password, // Only include if you want to update the password
    };

    try {
      await axios.put(`http://localhost:3002/user/user/${id}`, updatedUser);
      swal("Success", "User updated successfully!", "success");
      navigate('/view-users');
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
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px'}}
        >
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'50px' }}>
            Update User
          </Typography>

          <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.title}>
              <InputLabel>Title</InputLabel>
              <Select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                label="Title"
              >
                <MenuItem value="Mr">Mr</MenuItem>
                <MenuItem value="Mrs">Mrs</MenuItem>
                <MenuItem value="Miss">Miss</MenuItem>
                <MenuItem value="Dr">Dr</MenuItem>
                <MenuItem value="Prof">Prof</MenuItem>
              </Select>
              <FormHelperText>{errors.title}</FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              helperText={errors.firstName}
              error={!!errors.firstName}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              helperText={errors.lastName}
              error={!!errors.lastName}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              helperText={errors.address}
              error={!!errors.address}
            />
            <TextField
              fullWidth
              margin="normal"
              label="NIC"
              variant="outlined"
              value={nic}
              onChange={(e) => setNIC(e.target.value)}
              helperText={errors.nic}
              error={!!errors.nic}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              type="date"
              variant="outlined"
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              helperText={errors.dob}
              error={!!errors.dob}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contact"
              variant="outlined"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              helperText={errors.contact}
              error={!!errors.contact}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={errors.email}
              error={!!errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              label="City"
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              helperText={errors.city}
              error={!!errors.city}
            />
            <InputLabel>District</InputLabel>
            <Select
            fullWidth
            name="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            variant="outlined"
            margin="normal"
            >
            {districts.map((district) => (
                <MenuItem key={district} value={district}>
                {district}
                </MenuItem>
            ))}
            </Select>
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              Update User
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateUser;
