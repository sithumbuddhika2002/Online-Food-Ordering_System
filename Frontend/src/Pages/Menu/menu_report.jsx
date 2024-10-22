import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LetterHead from '../../Images/LetterHead.png'; // Adjust the path if needed
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
  },
  tableHeadCell: {
    backgroundColor: '#2E4857',
    color: 'white',
    border: '1px solid #F0EAD6',
  },
}));

const MenuReportPage = () => {
  const classes = useStyles();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/menu/get-menu-items');
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items.');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDownloadPDF = () => {
    const input = document.querySelector('.printable-area');
    const buttons = document.querySelectorAll('.no-print-button');
    buttons.forEach(button => (button.style.display = 'none'));
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.height; // Page height in mm
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight; // Position for the next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('menu_report.pdf');
      buttons.forEach(button => (button.style.display = ''));
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
            <Table className={classes.table} aria-label="menu table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadCell}>Menu Image</TableCell>
                  <TableCell className={classes.tableHeadCell}>Menu Item ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>Menu Item Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>Preparation Time</TableCell>
                  <TableCell className={classes.tableHeadCell}>Price</TableCell>
                  <TableCell className={classes.tableHeadCell}>Category</TableCell>
                  <TableCell className={classes.tableHeadCell}>Serving Size</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.menuItemId}>
                    <TableCell className={classes.tableCell}>
                      <img src={item.menuImage} alt={item.menuItemName} style={{ width: '120px', height: '80px' }} />
                    </TableCell>
                    <TableCell className={classes.tableCell}>{item.menuItemId}</TableCell>
                    <TableCell className={classes.tableCell}>{item.menuItemName}</TableCell>
                    <TableCell className={classes.tableCell}>{item.preparationTime}</TableCell>
                    <TableCell className={classes.tableCell}>{item.price}</TableCell>
                    <TableCell className={classes.tableCell}>{item.category}</TableCell>
                    <TableCell className={classes.tableCell}>{item.servingSize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuReportPage;
