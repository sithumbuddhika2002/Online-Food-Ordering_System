import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LetterHead from '../../Images/inventory2.png'; 
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
    fontSize: '12px', // Adjust the size as needed (e.g., '10px' for smaller text)
  },
  tableHeadCell: {
    backgroundColor: '#2E4857',
    color: 'white',
    border: '1px solid #F0EAD6',
    fontSize: '12px',
  },
  scrollableContainer: {
    overflowX: 'auto', // Enable horizontal scrolling
    width: '100%', // Ensure it takes full width
    whiteSpace: 'nowrap', // Prevent wrapping
  },
}));

const InventoryReportPage = () => {
  const classes = useStyles();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/inventory/get-inventory-items');
        setInventoryItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        setError('Failed to load inventory items.');
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const handleDownloadPDF = () => {
    const input = document.querySelector('.printable-area');
    const buttons = document.querySelectorAll('.no-print-button');
    buttons.forEach(button => (button.style.display = 'none'));
    
    // Clone the printable area to prevent layout issues
    const clonedInput = input.cloneNode(true);
    const scrollableContainer = clonedInput.querySelector(`.${classes.scrollableContainer}`);
    
    // Remove any extra styling to ensure it fits well in the PDF
    scrollableContainer.style.overflowX = 'visible';
    scrollableContainer.style.whiteSpace = 'normal';
    scrollableContainer.style.overflowY = 'visible'; // Ensure vertical scroll is visible too
  
    // Set a fixed width for the PDF to avoid cropping
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
  
    // Append the cloned input to the body to render
    document.body.appendChild(clonedInput);
  
    // Calculate the full height of the content
    const contentHeight = clonedInput.scrollHeight;
  
    // Use html2canvas to capture the content
    html2canvas(clonedInput, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const imgWidth = pdfWidth; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let position = 0;
      
      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      let heightLeft = imgHeight - pdfHeight;
  
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight; // Position for the next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save('inventory_report.pdf');
      document.body.removeChild(clonedInput); // Clean up
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
            position: 'relative',
            overflow: 'hidden', // Ensure the sidebar does not affect this layout
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
          <Box className={classes.scrollableContainer}>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table className={classes.table} aria-label="inventory table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeadCell}>Item ID</TableCell>
                    <TableCell className={classes.tableHeadCell}>Item Name</TableCell>
                    <TableCell className={classes.tableHeadCell}>Category</TableCell>
                    <TableCell className={classes.tableHeadCell}>Description</TableCell>
                    <TableCell className={classes.tableHeadCell}>Unit of Measure</TableCell>
                    <TableCell className={classes.tableHeadCell}>Quantity in Stock</TableCell>
                    <TableCell className={classes.tableHeadCell}>Reorder Level</TableCell>
                    <TableCell className={classes.tableHeadCell}>Reorder Quantity</TableCell>
                    <TableCell className={classes.tableHeadCell}>Supplier ID</TableCell>
                    <TableCell className={classes.tableHeadCell}>Cost Price</TableCell>
                    <TableCell className={classes.tableHeadCell}>Date Added</TableCell>
                    <TableCell className={classes.tableHeadCell}>Last Restocked</TableCell>
                    <TableCell className={classes.tableHeadCell}>Expiration Date</TableCell>
                    <TableCell className={classes.tableHeadCell}>Brand</TableCell>
                    <TableCell className={classes.tableHeadCell}>Location</TableCell>
                    <TableCell className={classes.tableHeadCell}>Stock Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell className={classes.tableCell}>{item.itemId}</TableCell>
                      <TableCell className={classes.tableCell}>{item.itemName}</TableCell>
                      <TableCell className={classes.tableCell}>{item.category}</TableCell>
                      <TableCell className={classes.tableCell}>{item.description}</TableCell>
                      <TableCell className={classes.tableCell}>{item.unitOfMeasure}</TableCell>
                      <TableCell className={classes.tableCell}>{item.quantityInStock}</TableCell>
                      <TableCell className={classes.tableCell}>{item.reorderLevel}</TableCell>
                      <TableCell className={classes.tableCell}>{item.reorderQuantity}</TableCell>
                      <TableCell className={classes.tableCell}>{item.supplierId}</TableCell>
                      <TableCell className={classes.tableCell}>{item.costPrice}</TableCell>
                      <TableCell className={classes.tableCell}>{new Date(item.dateAdded).toLocaleDateString()}</TableCell>
                      <TableCell className={classes.tableCell}>{item.lastRestockedDate ? new Date(item.lastRestockedDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className={classes.tableCell}>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className={classes.tableCell}>{item.brand}</TableCell>
                      <TableCell className={classes.tableCell}>{item.locationInStore}</TableCell>
                      <TableCell className={classes.tableCell}>{item.stockStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Footer className="no-print" />
    </Box>
  );
};

export default InventoryReportPage;
