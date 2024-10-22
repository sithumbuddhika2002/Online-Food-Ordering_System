import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper } from '@material-ui/core';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';


const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    margin: '15px',
    padding: '20px',
    width: '1005px'
  },
  formField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
}));

const UpdateDeliveryForm = () => {
  const classes = useStyles();
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    deliveryDistrict: '',
    deliveryDate: '',
    phone: '',
    email: '',
    whatsappNo: '',
    orderNotes: '',
    totalPrice: '',
    status: '',
  });

  // Fetch delivery details when the component mounts
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/delivery/get-delivery/${id}`);
        setDeliveryDetails(response.data);
      } catch (error) {
        console.error('Error fetching delivery details', error);
      }
    };

    fetchDeliveryDetails();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDeliveryDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3002/delivery/update-delivery/${id}`, deliveryDetails);
      
      // Success notification using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Delivery updated successfully',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/view-delivery'); // Navigate back to the delivery list after the alert is closed
      });
  
    } catch (error) {
      console.error('Error updating delivery', error);
      
      // Error notification using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  };
  
  return (
    <Box style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      <Header />
      <Box display="flex" flexDirection="row" height="100%">
        <Sidebar />
        <Paper className={classes.formContainer}>
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'black',marginTop: '35px', marginBottom: '50px' }}>
            Update Delivery
          </Typography>
          <form onSubmit={handleFormSubmit} style={{paddingLeft:'25px', paddingRight:'25px'}}>
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={deliveryDetails.firstName}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={deliveryDetails.lastName}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              value={deliveryDetails.address}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="City"
              variant="outlined"
              name="city"
              value={deliveryDetails.city}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="District"
              variant="outlined"
              name="deliveryDistrict"
              value={deliveryDetails.deliveryDistrict}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="Delivery Date"
              variant="outlined"
              name="deliveryDate"
              type="date"
              value={deliveryDetails.deliveryDate.split('T')[0]} 
              onChange={handleInputChange}
              className={classes.formField}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Phone"
              variant="outlined"
              name="phone"
              value={deliveryDetails.phone}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={deliveryDetails.email}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="WhatsApp No"
              variant="outlined"
              name="whatsappNo"
              value={deliveryDetails.whatsappNo}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="Order Notes"
              variant="outlined"
              name="orderNotes"
              value={deliveryDetails.orderNotes}
              onChange={handleInputChange}
              className={classes.formField}
              multiline={true}
              rows={4}
            />
            <TextField
              label="Total Price"
              variant="outlined"
              name="totalPrice"
              value={deliveryDetails.totalPrice}
              onChange={handleInputChange}
              className={classes.formField}
            />
            <TextField
              label="Status"
              variant="outlined"
              name="status"
              value={deliveryDetails.status}
              onChange={handleInputChange}
              className={classes.formField}
              select
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
            <Box className={classes.buttonContainer}>
              <Button type="submit" variant="contained" color="primary" fullWidth style={{marginRight:'40px'}}>
                Update
              </Button>
              <Button variant="contained" color="secondary" fullWidth onClick={() => navigate('/view-delivery')}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default UpdateDeliveryForm;
