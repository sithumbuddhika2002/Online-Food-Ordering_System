import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddEmployeeForm.css';
import APIUrl from './APIUrl';
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';

const AddNewEmployeeForm = () => {
  const [newEmployee, setNewEmployee] = useState({
    uid: "E" + generateId(),
    name: '',
    nic: '',
    birthday: '',
    status: 'Deactivate',
    phone: '',
    email: '',
    type: 'Hourly Workers', // Default role is Hourly Workers
    fixedSalary: 0,
    hourlySalary: 0,
    otHours: 0,
    password: ''
  });

  const info = JSON.parse(localStorage.getItem("selectedEmployee"));

  useEffect(() => {
    if (info?.editBtn) {
      setNewEmployee(info.selectedEmployee);
    }
  }, []);

  const [errors, setErrors] = useState({});

  function generateId() {
    let id = '';
    for (let i = 0; i < 9; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }

  const handleAddEmployee = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(`${APIUrl}/admin/register`, newEmployee);
        if (response.data.message !== "Email is Already Used") {
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/employeemanage";
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Email Already Taken",
            icon: "error",
            confirmButtonText: "OK",
          });
          setTimeout(() => {
            window.location.href = "/EmployeeForm";
          }, 3000);
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Registration Not Success",
          icon: "error",
          confirmButtonText: "OK",
        });
        setTimeout(() => {
          window.location.href = "/EmployeeForm";
        }, 3000);
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!newEmployee.uid.trim()) {
      errors.uid = 'Employee ID is required';
      isValid = false;
    }

    if (!newEmployee.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!newEmployee.nic.trim()) {
      errors.nic = 'NIC is required';
      isValid = false;
    } else if (!/^\d{12}$/.test(newEmployee.nic.trim()) && !/^\d{9}v$/.test(newEmployee.nic.trim())) {
      errors.nic = 'NIC must be exactly 12 digits or 9 digits followed by a letter "v"';
      isValid = false;
    }

    if (!newEmployee.birthday.trim()) {
      errors.birthday = 'Birthday is required';
      isValid = false;
    } else if (!isOver18(newEmployee.birthday)) {
      errors.birthday = 'Employee must be at least 18 years old';
      isValid = false;
    }

    if (!newEmployee.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(newEmployee.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
      isValid = false;
    }

    if (!newEmployee.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email.trim())) {
      errors.email = 'Email is not valid';
      isValid = false;
    }

    if (!newEmployee.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (newEmployee.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (!newEmployee.fixedSalary && !newEmployee.hourlySalary) {
      errors.salary = 'Either fixed salary or hourly salary is required';
      isValid = false;
    }

    if (!newEmployee.type) {
      errors.type = 'Employee role is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const isOver18 = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && monthDifference >= 0 && today.getDate() >= birthDate.getDate());
  };

  const handleEditEmployee = async () => {
    if (validateForm()) {
      newEmployee.uid = info.selectedEmployee.uid;
      try {
        await axios.put(APIUrl + "/admin/update", newEmployee);
        Swal.fire({
          title: "Success!",
          text: "Employee updated successfully.",
          icon: 'success',
          confirmButtonText: "OK"
        });
        localStorage.setItem('selectedEmployee', JSON.stringify({}));
        setTimeout(() => {
          window.location.href = "/employeemanage";
        }, 1000);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update Employee.",
          icon: 'error',
          confirmButtonText: "OK"
        });
        localStorage.setItem('selectedEmployee', JSON.stringify({}));
        setTimeout(() => {
          window.location.href = "/Employee";
        }, 1000);
      }
    }
  }

  const handleCancel = () => {
    localStorage.setItem('selectedEmployee', JSON.stringify({}));
    window.location.href = "/employeemanage";
  };

  return (
    <div>
    <Navbar />
    <div style={{ display: 'flex'}}>
    <Sidebar />
    <Box className="container" style={{ flex: 1, padding: '20px' }}>
      <AppBar position="relative" className="appBar">
        <Toolbar className="toolbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" className="title">
            {info?.editBtn ? 'Edit Employee' : 'Add New Employee'}
          </Typography>
          <div className="buttonGroup">
            <Button variant="contained" color="primary" onClick={info?.editBtn ? handleEditEmployee : handleAddEmployee}>
              {info?.editBtn ? 'Edit Employee' : 'Add Employee'}
            </Button>
            <Button variant="contained" onClick={handleCancel} className="cancelButton">
              Cancel
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className="content">
        <Typography variant="h6" className="formTitle" style={{marginBottom:'30px', fontSize:'25px', color:'purple'}}>
          {info?.editBtn ? 'Edit Employee Form' : 'Add New Employee Form'}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Employee ID"
              fullWidth
              value={newEmployee.uid}
              error={!!errors.uid}
              helperText={errors.uid}
              disabled
              className="textField"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              className="textField"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="NIC"
              fullWidth
              value={newEmployee.nic}
              onChange={(e) => setNewEmployee({ ...newEmployee, nic: e.target.value })}
              error={!!errors.nic}
              helperText={errors.nic}
              className="textField"
              disabled={info?.editBtn}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Birthday"
              type="date"
              fullWidth
              value={newEmployee.birthday}
              onChange={(e) => setNewEmployee({ ...newEmployee, birthday: e.target.value })}
              error={!!errors.birthday}
              helperText={errors.birthday}
              className="textField"
              InputLabelProps={{
                shrink: true,
              }}
              disabled={info?.editBtn}
            />
          </Grid>
          <Grid item xs={12}> 
            <TextField
              label="Email"
              fullWidth
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              className="textField"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              fullWidth
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              error={!!errors.phone}
              helperText={errors.phone}
              className="textField"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Role"
              select
              fullWidth
              value={newEmployee.type}
              onChange={(e) => setNewEmployee({ ...newEmployee, type: e.target.value })}
              error={!!errors.type}
              helperText={errors.type}
              className="textField"
            >
              <MenuItem value="Hourly Workers">Hourly Workers</MenuItem>
              <MenuItem value="Managers">Managers</MenuItem>
              <MenuItem value="Chef">Chef</MenuItem>
              <MenuItem value="Waiters">Waiters</MenuItem>
              <MenuItem value="Cashier">Cashier</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fixed Salary"
              fullWidth
              type="number"
              value={newEmployee.fixedSalary}
              onChange={(e) => setNewEmployee({ ...newEmployee, fixedSalary: e.target.value })}
              error={!!errors.fixedSalary}
              helperText={errors.fixedSalary}
              className="textField"
              disabled={newEmployee.type === 'Hourly Workers'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Hourly Salary"
              fullWidth
              type="number"
              value={newEmployee.hourlySalary}
              onChange={(e) => setNewEmployee({ ...newEmployee, hourlySalary: e.target.value })}
              error={!!errors.hourlySalary}
              helperText={errors.hourlySalary}
              className="textField"
              disabled={['Managers', 'Chef', 'Waiters', 'Cashier'].includes(newEmployee.type)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="OT Hours Salary"
              fullWidth
              type="number"
              value={newEmployee.otHours}
              onChange={(e) => setNewEmployee({ ...newEmployee, otHours: e.target.value })}
              error={!!errors.otHours}
              helperText={errors.otHours}
              className="textField"
              disabled={newEmployee.type === 'Hourly Workers'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              disabled={info?.editBtn}
              className="textField"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
    </div>
    </div>
  );
};

export default AddNewEmployeeForm;
