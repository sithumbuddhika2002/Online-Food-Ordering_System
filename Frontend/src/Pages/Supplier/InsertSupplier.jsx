import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Box from '@mui/material/Box'; // Assuming you are using Material-UI
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';
import styles from './InsertSupplier.css'; // Import the CSS module

const validationSchema = Yup.object().shape({
  supplierID: Yup.string().required('Supplier ID is required'),
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  
  // NIC validation: Supports both the older format (9 digits + 'V', 'X') and the newer 12-digit format.
  nic: Yup.string()
    .required('NIC is required')
    .matches(
      /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
      'Invalid NIC format. Must be 9 digits followed by "V" or "X", or 12 digits.'
    ),
  
  product: Yup.string().required('Product is required'),
  
  // Contact Number validation: Must start with +94 followed by exactly 9 digits or be a 10-digit number.
  contactNo: Yup.string()
    .required('Contact No is required')
    .matches(
      /^\+94[0-9]{9}$|^[0-9]{10}$/,
      'Invalid contact number. Must be either +94 followed by 9 digits or exactly 10 digits.'
    ),
});

const InsertSupplier = () => {
  const handleSubmit = (values, { resetForm }) => {
    axios.post("http://localhost:3000/api/suppliers", values)
      .then(() => {
        resetForm();
      })
      .catch((err) => {
        console.error('Error submitting form:', err);
      });
  };

  return (
    <div>
      <Navbar />
      <Box display="flex" flexDirection="row">
        {/* Sidebar on the left */}
        <Box className={styles.sidebar}>
          <Sidebar />
        </Box>

        {/* The form and image will be side by side */}
        <Box display="flex" flexDirection="row" flexGrow={1} p={5}>

          {/* Form on the left side */}
          <Box flex={1} p={2} className={styles.formContainer}>
            <h2 style={{ fontFamily: 'cursive', color: 'purple', marginBottom: '50px', fontSize: '30px' }}>Supplier Information Form</h2>
            <Formik
              initialValues={{
                supplierID: '',
                name: '',
                nic: '',
                product: '',
                contactNo: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
                    <label>Supplier ID:</label>
                    <Field type="text" id="supplierID" name="supplierID" />
                    <ErrorMessage name="supplierID" component="div" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }} />
                  </div>

                  <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
                    <label>Name:</label>
                    <Field type="text" id="name" name="name" />
                    <ErrorMessage name="name" component="div" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }} />
                  </div>

                  <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
                    <label>NIC:</label>
                    <Field type="text" id="nic" name="nic" />
                    <ErrorMessage name="nic" component="div" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }} />
                  </div>

                  <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
                    <label>Product:</label>
                    <Field type="text" id="product" name="product" />
                    <ErrorMessage name="product" component="div" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }} />
                  </div>

                  <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
                    <label>Contact No:</label>
                    <Field type="text" id="contactNo" name="contactNo" />
                    <ErrorMessage name="contactNo" component="div" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }} />
                  </div>

                  <button style={{ width: '105%' }} type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </Box>

          {/* Image on the right side */}
          <Box flex={1} p={2} className={styles.imageContainer}>
            <img 
              src="https://media.istockphoto.com/id/1460822484/photo/warehouse-tablet-and-people-teamwork-for-storage-inventory-and-supply-chain-management-for.jpg?s=612x612&w=0&k=20&c=ADW05TJoWOGkNuLzzLlxwoVA5v4TzfVxDG4BsL5TP3I=" // Replace with the actual image URL
              alt="Supplier Form" 
              style={{ width: '100%', height: 'auto', borderRadius: '10px', marginTop: '140px', marginLeft: '30px' }} 
            />
          </Box>

        </Box>
      </Box>
    </div>
  );
};

export default InsertSupplier;
