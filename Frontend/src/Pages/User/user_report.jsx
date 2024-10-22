import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LetterHead from '../../Images/invoice2.png'; // Adjust the path if needed
import Footer from '../../Components/customer_footer';

// CSS for print
const styles = `
@media print {
  body * {
    visibility: hidden;
  }
  .printable-area, .printable-area * {
    visibility: visible;
  }
  .printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: 2px solid #000; 
  }
  .no-print {
    display: none !important;
  }
}
`;

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    borderCollapse: 'collapse', 
  },
  tableContainer: {
    marginBottom: theme.spacing(2),
    boxShadow: 'none', 
    border: 'none', 
  },
  letterhead: {
    textAlign: 'center',
    borderRadius: '8px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
    '& button': {
      marginLeft: theme.spacing(1),
    },
  },
  tableCell: {
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid #F0EAD6',
    fontSize: '12px',
  },
  tableHeadCell: {
    backgroundColor: '#2E4857',
    color: 'white',
    border: '1px solid #F0EAD6',
    fontSize: '12px',
  },
  scrollableTable: {
    overflowX: 'auto', // Enables horizontal scrolling
    width: '100%', // Ensure it takes full width
    whiteSpace: 'nowrap', // Prevent wrapping
  },
}));

const UserReportPage = () => {
  const classes = useStyles();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/user/get-users'); // Adjust the endpoint
        setUserItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user items:', error);
        setError('Failed to load user items.');
        setLoading(false);
      }
    };

    fetchUserItems();
  }, []);

  const handleDownloadPDF = () => {
    const input = document.querySelector('.printable-area');
    
    if (!input) {
      console.error("Printable area not found");
      return;
    }
  
    const buttons = document.querySelectorAll('.no-print-button');
    if (buttons.length === 0) {
      console.error("No buttons found to hide");
      return;
    }
  
    // Hide buttons temporarily
    buttons.forEach(button => button.style.display = 'none');
  
    // Clone the printable area to prevent layout issues
    const clonedInput = input.cloneNode(true);
    const scrollableContainer = clonedInput.querySelector(`.${classes.scrollableContainer}`);
  
    if (scrollableContainer) {
      // Remove extra styling for better PDF rendering
      scrollableContainer.style.overflowX = 'visible';
      scrollableContainer.style.whiteSpace = 'normal';
      scrollableContainer.style.overflowY = 'visible'; // Ensure vertical scroll is visible too
    }
  
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
  
    // Append cloned input to body temporarily to render
    document.body.appendChild(clonedInput);
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait orientation
  
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      let heightLeft = imgHeight - pdfHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save('user_report.pdf');
  
      // Clean up
      document.body.removeChild(clonedInput);
      buttons.forEach(button => button.style.display = '');
    }).catch((error) => {
      console.error("Error generating PDF:", error);
    });
  };
  
  
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <Box style={{backgroundColor: 'black', minHeight: '100vh'}}>
      <Header className="no-print" />
      <Box display="flex">
        <Sidebar className="no-print" />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          className="printable-area"
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            flex: 1,
            margin: '15px',
            overflow: 'hidden',
            width: '90%'
          }}
        >
          <Box className={`${classes.buttonsContainer} no-print-button`}>
            <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Box>
          <Box className={classes.letterhead}>
            <img src={LetterHead} alt="Letterhead" style={{ width: '100%', height: 'auto' }} />
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <div className={classes.scrollableTable}>
              <Table className={classes.table} aria-label="user table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeadCell}>Full Name</TableCell>
                    <TableCell className={classes.tableHeadCell}>Address</TableCell>
                    <TableCell className={classes.tableHeadCell}>NIC</TableCell>
                    <TableCell className={classes.tableHeadCell}>DOB</TableCell>
                    <TableCell className={classes.tableHeadCell}>Contact</TableCell>
                    <TableCell className={classes.tableHeadCell}>City</TableCell>
                    <TableCell className={classes.tableHeadCell}>District</TableCell>
                    <TableCell className={classes.tableHeadCell}>Email Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userItems.map((item) => (
                    <TableRow key={item.NIC}>
                      <TableCell className={classes.tableCell}>{item.title} {item.firstName} {item.lastName}</TableCell>
                      <TableCell className={classes.tableCell}>{item.address}</TableCell>
                      <TableCell className={classes.tableCell}>{item.NIC}</TableCell>
                      <TableCell className={classes.tableCell}>{new Date(item.DOB).toLocaleDateString()}</TableCell>
                      <TableCell className={classes.tableCell}>{item.contact}</TableCell>
                      <TableCell className={classes.tableCell}>{item.city}</TableCell>
                      <TableCell className={classes.tableCell}>{item.district}</TableCell>
                      <TableCell className={classes.tableCell}>{item.emailAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default UserReportPage;
