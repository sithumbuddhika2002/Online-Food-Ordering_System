import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import './SalaryForm.css';
import APIUrl from './APIUrl';
import Navbar from '../../Components/guest_header'; // Keeping this in the layout
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';

const SalaryForm = () => {
    const [newSalary, setNewSalary] = useState({
        uid: '',
        name: '',
        hourlySalary: 0,
        hour: 0,
        fullSalary: 0
    });

    const [errors, setErrors] = useState({});

    const handleAddSalary = async () => {
        if (validateForm()) {
            try {
                await axios.post(APIUrl + '/salary/add', newSalary);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Salary added successfully'
                }).then(() => {
                    window.location.href = "/employeemanage";
                });
            } catch (error) {
                console.error('Error adding salary:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error adding salary'
                }).then(() => {
                    window.location.href = "/SalaryForm";
                });
            }           
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!newSalary.uid) {
            errors.uid = 'Employee ID is required';
            isValid = false;
        }

        if (!newSalary.name) {
            errors.name = 'Name is required';
            isValid = false;
        }

        if (newSalary.hour <= 0) {
            errors.hour = 'Hour must be greater than 0';
            isValid = false;
        }

        if (newSalary.hourlySalary <= 0) {
            errors.hourlySalary = 'Hourly Salary must be greater than 0';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        window.location.href = "/employeemanage";
    };

    useEffect(() => {
        const calculateSalary = () => {
            setNewSalary(prevState => ({
                ...prevState,
                fullSalary: prevState.hour * prevState.hourlySalary
            }));
        };
        calculateSalary();
    }, [newSalary.hour, newSalary.hourlySalary]);

    return (
        <div>
        <Header></Header>
        <div style={{ display: 'flex'}}>
            <Sidebar />
            <div className="salary-form-container" style={{ flex: 1, padding: '20px' }}>
                <AppBar position="relative" className="salary-appbar">
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                            Add Employee Salary
                        </Typography>
                        <div>
                            <Button variant="contained" color="primary" onClick={handleAddSalary} style={{backgroundColor:'purple'}}>
                                Add
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleCancel}
                                className="salary-buttons"
                                style={{ marginLeft: '10px' , backgroundColor:'purple'}} // Add margin for spacing
                            >
                                Cancel
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    <div className="salary-form-content">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="salary-form-header">
                                    Employee Salary Calculation Form
                                </Typography>
                                <hr />
                                <Typography variant="h6" className="salary-calculate-header">
                                    Calculated Salary: {newSalary.fullSalary.toFixed(2)}
                                </Typography>
                                <hr />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Employee ID"
                                    fullWidth
                                    placeholder="A4562"
                                    value={newSalary.uid}
                                    onChange={(e) => setNewSalary({ ...newSalary, uid: e.target.value })}
                                    error={!!errors.uid}
                                    helperText={errors.uid}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    value={newSalary.name}
                                    onChange={(e) => setNewSalary({ ...newSalary, name: e.target.value })}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Hours Worked"
                                    fullWidth
                                    value={newSalary.hour}
                                    onChange={(e) => setNewSalary({ ...newSalary, hour: Math.max(0, e.target.value) })} // Prevent negative input
                                    error={!!errors.hour}
                                    helperText={errors.hour}
                                    type="number"
                                    inputProps={{ min: "0" }} // Prevent negative numbers in the input
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Hourly Salary"
                                    fullWidth
                                    value={newSalary.hourlySalary}
                                    onChange={(e) => setNewSalary({ ...newSalary, hourlySalary: Math.max(0, e.target.value) })} // Prevent negative input
                                    error={!!errors.hourlySalary}
                                    helperText={errors.hourlySalary}
                                    type="number"
                                    inputProps={{ min: "0" }} // Prevent negative numbers in the input
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>
        </div>
        </div>
    );
};

export default SalaryForm;
