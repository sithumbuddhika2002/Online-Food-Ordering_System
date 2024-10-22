import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/guest_header';
import Sidebar from '../../Components/sidebar';
import Swal from 'sweetalert2'; // Import SweetAlert

const InsertPromotion = () => {
  const [promotion, setPromotions] = useState({
    promotionID: '',
    code: '',
    foodItem: '',
    codeCategory: '',
    discount: '',
    expirationDate: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const generatePromotionID = () => {
    return Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
  };

  useEffect(() => {
    const newPromotionID = generatePromotionID();
    setPromotions((prevPromotion) => ({
      ...prevPromotion,
      promotionID: newPromotionID,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPromotions((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateFields = () => {
    let errors = {};

    for (const [key, value] of Object.entries(promotion)) {
      if (!value) {
        errors[key] = 'This field is required.';
      }
    }

    const discountValue = Math.max(1, Math.min(100, parseInt(promotion.discount, 10) || 0));
    if (discountValue < 1 || discountValue > 100) {
      errors.discount = 'Discount must be between 1 and 100.';
    }

    const minDate = new Date('2024-01-01');
    const maxDate = new Date('2025-12-31');
    const selectedExpirationDate = new Date(promotion.expirationDate);
    if (selectedExpirationDate < minDate || selectedExpirationDate > maxDate) {
      errors.expirationDate = 'Expiration date must be between 2024 and 2025.';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Mark the form as submitted

    const errors = validateFields();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios.post('http://localhost:3002/api/promotions', promotion)
        .then(() => {
          setPromotions({
            promotionID: generatePromotionID(), // Generate a new ID for the next promotion
            code: '',
            foodItem: '',
            codeCategory: '',
            discount: '',
            expirationDate: '',
          });
          
          // Show success message with SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Promotion code added successfully!',
            confirmButtonText: 'OK',
          });
        })
        .catch((error) => {
          setErrorMessage('Failed to add promotion code. Please try again.');
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000);
        });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '20px', fontFamily: 'cursive', color: 'purple', textAlign: 'center' }}>Add Promotion Code</div>
          <div style={{ backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            {/* Success/Error Popup */}
            {showPopup && (
              <div style={{
                padding: '10px',
                backgroundColor: errorMessage ? '#f8d7da' : '#d4edda',
                color: errorMessage ? '#721c24' : '#155724',
                border: `1px solid ${errorMessage ? '#f5c6cb' : '#c3e6cb'}`,
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor='promoCodeId'>Promotion Code ID</label>
                <input
                  type='text'
                  id='promoCodeId'
                  name='promotionID'
                  placeholder='Enter Code ID'
                  value={promotion.promotionID}
                  readOnly
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} // Make it read-only
                  disabled
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor='promoCode'>Promotion Code</label>
                <input
                  type='text'
                  id='promoCode'
                  name='code'
                  placeholder='Enter Promotion Code'
                  onChange={handleChange}
                  value={promotion.code}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: validationErrors.code && isSubmitted ? '1px solid #dc3545' : '1px solid #ccc' }}
                />
                {validationErrors.code && isSubmitted && <span style={{ color: '#dc3545' }}>{validationErrors.code}</span>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor='appliedFoodItem'>Applied Food Item</label>
                <select
                  id='appliedFoodItem'
                  name='foodItem'
                  value={promotion.foodItem}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: validationErrors.foodItem && isSubmitted ? '1px solid #dc3545' : '1px solid #ccc' }}
                >
                  <option value='' disabled>
                    Select a Food Item
                  </option>
                  <option value='Golden Cheese Fries'>Golden Cheese Fries</option>
                  <option value='Cheinese Fish Soup'>Cheinese Fish Soup</option>
                  <option value='Fried Rice'>Fried Rice</option>
                  <option value='Burger'>Burger</option>
                  <option value='Biriyani'>Biriyani</option>
                  <option value='Chicken Kottu'>Chicken Kottu</option>
                  <option value='Cheese Kottu'>Cheese Kottu</option>
                  <option value='Devilled Chicken Pizza'>Devilled Chicken Pizza</option>
                  <option value='Seafood Pizza'>Seafood Pizza</option>
                  <option value='Cheezy Pasta'>Cheezy Pasta</option>
                </select>
                {validationErrors.foodItem && isSubmitted && <span style={{ color: '#dc3545' }}>{validationErrors.foodItem}</span>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor='promoCodeCategory'>Promotion Code Category</label>
                <select
                  id='promoCodeCategory'
                  name='codeCategory'
                  value={promotion.codeCategory}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: validationErrors.codeCategory && isSubmitted ? '1px solid #dc3545' : '1px solid #ccc' }}
                >
                  <option value='' disabled>
                    Select Category
                  </option>
                  <option value='Discount'>Discount</option>
                  <option value='Freebie'>Freebie</option>
                  <option value='Buy One Get One Free'>Buy One Get One Free</option>
                </select>
                {validationErrors.codeCategory && isSubmitted && <span style={{ color: '#dc3545' }}>{validationErrors.codeCategory}</span>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor='discount'>Discount</label>
                <input
                  type='number'
                  id='discount'
                  name='discount'
                  placeholder='Enter Discount'
                  onChange={handleChange}
                  value={promotion.discount}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: validationErrors.discount && isSubmitted ? '1px solid #dc3545' : '1px solid #ccc' }}
                />
                {validationErrors.discount && isSubmitted && <span style={{ color: '#dc3545' }}>{validationErrors.discount}</span>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor='expirationDate'>Expiration Date</label>
                <input
                  type='date'
                  id='expirationDate'
                  name='expirationDate'
                  min={today}
                  onChange={handleChange}
                  value={promotion.expirationDate}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: validationErrors.expirationDate && isSubmitted ? '1px solid #dc3545' : '1px solid #ccc' }}
                />
                {validationErrors.expirationDate && isSubmitted && <span style={{ color: '#dc3545' }}>{validationErrors.expirationDate}</span>}
              </div>

              <button type='submit' style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: 'purple', color: 'white', border: 'none' }}>
                Add Promotion Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsertPromotion;
