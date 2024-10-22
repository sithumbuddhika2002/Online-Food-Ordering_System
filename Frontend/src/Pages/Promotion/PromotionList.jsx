import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LetterHead from '../../Images/promotion.png'

const PromotionList = ({ promotions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPromotions, setFilteredPromotions] = useState(promotions);

  // Filter promotions based on search term
  useEffect(() => {
    setFilteredPromotions(
      promotions.filter((promotion) =>
        promotion.promotionID.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, promotions]);

  // Handle deletion of a promotion
  const onDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/promotions/${id}`);
      setFilteredPromotions((prev) => prev.filter((promo) => promo._id !== id));
    } catch (err) {
      console.error('Delete error', err);
    }
  };

// Function to fetch and convert the letterhead image to base64
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

// Generate PDF report of promotions with a letterhead image
const generateReport = () => {

  convertImageToBase64FromUrl(LetterHead)
    .then((LetterHead) => {
      const doc = new jsPDF();

      // Add letterhead image at the top
      doc.addImage(LetterHead, 'PNG', 10, 10, 190, 60); // Adjust the position and size as needed

      // Add report title below the letterhead
      doc.text('Promotion Codes Report', 20, 78);

      const columns = ['Code ID', 'Code', 'Food Item', 'Category', 'Discount'];
      const rows = filteredPromotions.map((promotion) => [
        promotion.promotionID,
        promotion.code,
        promotion.foodItem,
        promotion.codeCategory,
        promotion.discount,
      ]);

      // Add table starting at a position below the title
      doc.autoTable({
        startY: 80, // Adjusted to leave space for the letterhead and title
        head: [columns],
        body: rows,
      });

      // Save the generated PDF
      doc.save('promotions_report.pdf');
    })
    .catch((error) => {
      console.error('Error loading and converting image:', error);
    });
};



  return (
    <div>
      <div style={{ display: 'flex', width:'100%' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
            View Promotion Codes
          </div>
          <input
            type='text'
            placeholder='Search by Code ID...'
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ padding: '12px', border: '1px solid #ccc' }}>Code ID</th>
                  <th style={{ padding: '12px', border: '1px solid #ccc' }}>Code</th>
                  <th style={{ padding: '12px', border: '1px solid #ccc' }}>Food Item</th>
                  <th style={{ padding: '12px', border: '1px solid #ccc' }}>Category</th>
                  <th style={{ padding: '12px', border: '1px solid #ccc' }}>Discount</th>
                  <th style={{ padding: '12px', border: '1px solid #ccc' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promotion) => (
                    <tr key={promotion.promotionID}>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>{promotion.promotionID}</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>{promotion.code}</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>{promotion.foodItem}</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>{promotion.codeCategory}</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>{promotion.discount}</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>
                        <button
                          style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          onClick={() => onDeleteClick(promotion._id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/updatePromotion/${promotion._id}`}
                          style={{
                            display: 'inline-block',
                            marginLeft: '10px',
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                          }}
                        >
                          Update
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No promotions found</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                style={{
                  padding: '8px 12px', // Corrected closing quote here
                  marginRight: '10px',
                  border: 'none',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                }}
              >
                &lt;
              </button>

                <span>1</span>
                <button
                  style={{
                    padding: '8px 12px',
                    marginLeft: '10px',
                    border: 'none',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                  }}
                >
                  &gt;
                </button>
              </div>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={generateReport}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionList;
