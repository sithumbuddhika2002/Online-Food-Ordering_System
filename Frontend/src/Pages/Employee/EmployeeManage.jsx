import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from 'sweetalert2';
import APIUrl from './APIUrl';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // For generating tables
import './EmployeeManage.css';
import logopath from '../../Images/Employee.png';
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';

const EmployeeManage = () => {
    const [employee, setEmployee] = useState([]);
    const [salary, setSalary] = useState([]);

    useEffect(() => {
        fetchEmployeeDetails();
        fetchSalaryDetails();
    }, []);

    const fetchEmployeeDetails = async () => {
        try {
            const response = await axios.get(APIUrl + '/admin/getAll');
            const employeesWithId = response.data.map((employee, index) => ({
                id: index + 1,
                ...employee
            }));
            setEmployee(employeesWithId);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const fetchSalaryDetails = async () => {
        try {
            const response = await axios.get(APIUrl + '/salary/all');
            const salaryWithId = response.data.map((salary, index) => ({
                id: index + 1,
                ...salary
            }));
            setSalary(salaryWithId);
        } catch (error) {
            console.error('Error fetching salary details:', error);
        }
    };

    const handleAddEmployee = () => {
        window.location.href = "/EmployeeForm";
    };

    const handleEditEmployee = (selectedEmployee) => {
        const editBtn = true;
        const data = {
            selectedEmployee,
            editBtn
        };
        localStorage.setItem('selectedEmployee', JSON.stringify(data));
        window.location.href = "/EmployeeForm";
    };

    const handleUpdateEmployee = async (selectedEmployee) => {
        try {
            let updatedStatus;
            if (selectedEmployee.status === 'Activate') {
                updatedStatus = 'Deactivate';
            } else {
                updatedStatus = 'Activate';
            }

            const updatedEmployee = { ...selectedEmployee, status: updatedStatus };
            await axios.put(`${APIUrl}/admin/update`, updatedEmployee);

            setEmployee(prevEmployees =>
                prevEmployees.map(employee =>
                    employee.id === selectedEmployee.id ? updatedEmployee : employee
                )
            );
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeleteEmployee = (employeeId) => {
        axios.delete(APIUrl + "/admin/delete/" + employeeId).then(() => {
            window.location.href = "/employeemanage";
        }).catch((err) => {
            Swal.fire({
                title: "Error!",
                text: "Employee Not Deleted",
                icon: 'error',
                confirmButtonText: "OK"
            });
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Deactivate':
                return 'red';
            case 'Activate':
                return 'green';
            default:
                return 'black';
        }
    };

    const columns = [
        { field: 'uid', headerName: 'Employee ID', width: 150 },
        { field: 'name', headerName: 'Employee Name', width: 150 },
        { field: 'nic', headerName: 'NIC', width: 150 },
        { field: 'birthday', headerName: 'Birthday', width: 100 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'fixedSalary', headerName: 'Fixed Salary', width: 150 },
        { field: 'hourlySalary', headerName: 'Hourly Salary', width: 150 },
        { field: 'otHours', headerName: 'OT Salary', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'phone', headerName: 'Phone No', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    style={{ color: getStatusColor(params.value), borderColor: getStatusColor(params.value) }}
                    disabled
                >
                    {params.value}
                </Button>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div>
                    {params.row.status === 'Activate' ? (
                        <IconButton color="error" onClick={() => handleUpdateEmployee(params.row)}>
                            <CloseIcon />
                        </IconButton>
                    ) : (
                        <IconButton color="success" onClick={() => handleUpdateEmployee(params.row)}>
                            <CheckIcon />
                        </IconButton>
                    )}
                    <IconButton color="primary" onClick={() => handleEditEmployee(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteEmployee(params.row.uid)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const column = [
        { field: 'uid', headerName: 'Employee ID', width: 150 },
        { field: 'name', headerName: 'Employee Name', width: 200 },
        { field: 'role', headerName: 'Employee Role', width: 200 },
        { field: 'fixedSalary', headerName: 'Fixed Salary', width: 200 },
        { field: 'hourlySalary', headerName: 'Hourly Salary or OT Hours', width: 200 },
        { field: 'hour', headerName: 'Hours', width: 100 },
        { field: 'fullSalary', headerName: 'Full Salary', width: 200 },
    ];

    const handleAddSalary = () => {
        window.location.href = "/salary";
    };
    
const handleGeneratePDF = () => {
    // Function to fetch the image from assets folder and convert it to base64
    const convertImageToBase64FromUrl = (url) => {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob); // Converts blob to base64
            }));
    };

    convertImageToBase64FromUrl(logopath).then((logoBase64) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        // Remove letterhead rectangle and add image instead
        // Add the logo image or letterhead image on top of the page
        doc.addImage(logoBase64, 'PNG', 30, 20, doc.internal.pageSize.width - 60, 110); // Adjust dimensions as needed

        // Company Name Title
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);

        // Report Title
        doc.setFontSize(16);
        doc.setFillColor(217, 234, 221);
        doc.rect(30, 130, doc.internal.pageSize.width - 60, 30, 'F');
        doc.text('Salary Report Sheet', doc.internal.pageSize.width / 2, 150, { align: 'center' });
        doc.setFontSize(12);

        // Table Headers and Body
        const tableBody = salary.map((sal, index) => [
            index + 1, sal.uid, sal.name, sal.role, sal.fixedSalary, sal.hourlySalary, sal.hour, sal.fullSalary.toFixed(2)
        ]);

        doc.autoTable({
            startY: 180, // Adjusted to leave space for the logo and title
            head: [['Sr. No.', 'ID', 'Name', 'Role', 'Fixed Salary', 'Hourly Salary/ OT Hours', 'Hour', 'Full Salary']],
            body: tableBody,
            styles: {
                fontSize: 10,
                halign: 'center',
                valign: 'middle',
            },
            headStyles: {
                fillColor: [153, 204, 255],
                textColor: [0, 0, 0],
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
                lineColor: [200, 200, 200],
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255],
            },
            theme: 'grid',
            margin: { top: 130, left: 30, right: 30 },
            tableWidth: 'auto',
        });

        // Get the current date and time from the device
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString();
        const timeString = currentDate.toLocaleTimeString();

        // Footer Section
        const finalY = doc.autoTable.previous.finalY + 20;
        doc.setFontSize(12);
        doc.text('Prepared by: HR Manager', 60, finalY + 30); // Left-aligned

        // Add the signature line
        doc.text('..........................................', 60, finalY + 50); // Adjusted position for the signature line

        doc.text('Authorized by: HR Manager', doc.internal.pageSize.width - 160, finalY + 30); // Right-aligned
        doc.text(`Date: ${dateString} Time: ${timeString}`, doc.internal.pageSize.width - 160, finalY + 45); // Right-aligned, below the "Authorized by"

        // Save the document
        doc.save('Salary_Report.pdf');
    }).catch((error) => {
        console.error('Error loading and converting image:', error);
    });
};

    
    

    return (
        <div>
            <Navbar />
        <div className="root">
            <Sidebar />
            <div className="mainContent">
                <AppBar position="static" className="appBar" >
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Employee Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" style={{marginRight:'10px'}} color="secondary" className="headerButton" onClick={handleAddEmployee}>
                            Add New Employee
                        </Button>
                        <Button variant="contained" color="secondary" className="headerButton" onClick={handleAddSalary}>
                            Salary
                        </Button>
                    </Toolbar>
                </AppBar>

                <div className="container">
                    <Typography variant="h5" className="title" style={{ marginBottom:'15px', color:'purple'}}>
                        Employee Details
                    </Typography>
                    <div className="dataGridContainer">
                        <DataGrid rows={employee} columns={columns} pageSize={5} />
                    </div>
                </div>
                <div className="container">
                    <Typography variant="h5" className="title" style={{ marginBottom:'15px', color:'purple'}}>
                        Salary Details
                    </Typography>
                    <div className="dataGridContainer">
                        <DataGrid rows={salary} columns={column} pageSize={5} />
                    </div>
                </div>

                <div className="container">
                    <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
                        Generate PDF
                    </Button>
                </div>
            </div>
        </div>
        </div>
    ); 
};

export default EmployeeManage;
