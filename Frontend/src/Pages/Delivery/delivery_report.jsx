import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Footer from '../../Components/customer_footer'; // Assuming you have a footer component
import LetterHead from '../../Images/delivery.png'; // Import your letterhead image

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
    border: '1px solid #F0EAD6 !important',
    fontSize: '12px',
  },
  tableHeadCell: {
    backgroundColor: '#2E4857 !important',
    color: 'white !important',
    border: '1px solid #F0EAD6 !important',
    fontSize: '12px',
  },
}));

const DeliveryReportPage = () => {
  const classes = useStyles();
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/delivery/get-deliveries');
        setDeliveryData(response.data);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
      }
    };

    fetchDeliveryData();
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
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('delivery_report.pdf');
      buttons.forEach(button => (button.style.display = ''));
    });
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <Box style={{backgroundColor: 'black'}}>
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
            overflow: 'hidden',
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
            <Table className={classes.table} aria-label="delivery table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadCell} >Delivery ID</TableCell>
                  <TableCell className={classes.tableHeadCell} >Full Name</TableCell>
                  <TableCell className={classes.tableHeadCell} >Address - City</TableCell>
                  <TableCell className={classes.tableHeadCell} >Delivery District</TableCell>
                  <TableCell className={classes.tableHeadCell} >Delivery Date</TableCell>
                  <TableCell className={classes.tableHeadCell} >Phone</TableCell>
                  <TableCell className={classes.tableHeadCell} >Order Notes</TableCell>
                  <TableCell className={classes.tableHeadCell} >Total Price</TableCell>
                  <TableCell className={classes.tableHeadCell} >Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryData.map((delivery) => (
                  <TableRow key={delivery.deliveryId}>
                  <TableCell>{delivery.deliveryId.substring(0,5)}</TableCell>
                  <TableCell>{delivery.firstName} {delivery.lastName}</TableCell>
                  <TableCell>{delivery.address}-{delivery.city}</TableCell>
                  <TableCell>{delivery.deliveryDistrict}</TableCell>
                  <TableCell>{new Date(delivery.deliveryDate).toLocaleDateString()}</TableCell>
                  <TableCell>{delivery.phone}</TableCell>
                  <TableCell>{delivery.orderNotes || 'N/A'}</TableCell>
                  <TableCell>Rs {delivery.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{delivery.status}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Footer className="no-print" />
    </Box>
  );
};

export default DeliveryReportPage;
