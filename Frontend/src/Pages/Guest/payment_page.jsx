import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import Navbar from '../../Components/guest_header';
import axios from 'axios'; 
import Swal from 'sweetalert2'; 

const PageContainer = styled.div`
  background-color: #000; 
  padding: 20px;
  min-height: 100vh;
`;

const PaymentPageContainer = styled.div`
  padding: 20px;
  background-color: #000;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaymentForm = styled.div`
  padding: 60px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const RadioGroup = styled.div`
  display: flex; 
  flex-wrap: wrap; 
  margin-bottom: 15px;
  justify-content: space-between; 
`;

const CardOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; 
  margin-right: 20px; 
`;

const CardImage = styled.img`
  width: 100px;
  margin-right: 10px;
  margin-left: 15px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const BackButtonStyled = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract payment details passed from the DeliveryForm
  const { paymentDetails } = location.state || {};

  // Default state for payment details
  const [cardType, setCardType] = useState(paymentDetails?.cardType || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState(paymentDetails?.email);
  const [promoCodeDetails, setPromoCodeDetails] = useState(null);

    // Function to fetch promotion code details
    const fetchPromoCodeDetails = async (promoCode) => {
      try {
        const response = await axios.get`(http://localhost:3002/promotions/${promoCode})`;
        setPromoCodeDetails(response.data);
        console.log('Promotion code details:', response.data);
      } catch (error) {
        console.error('Error fetching promotion code details:', error);
      }
    };
  
    // Call fetchPromoCodeDetails when the component mounts or when paymentDetails change
    useEffect(() => {
      if (paymentDetails?.promoCode) { // Assuming promoCode is part of paymentDetails
        fetchPromoCodeDetails(paymentDetails.promoCode);
      }
    }, [paymentDetails]);

  const formatCardNumber = (value) => {
    // Remove non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    return formatted;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);

    if (value.length !== 16) {
      setErrors((prev) => ({ ...prev, cardNumber: 'Card number must be 16 digits' }));
    } else {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    setExpiryDate(value);

    const [month, year] = value.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!/^\d{2}\/\d{2}$/.test(value)) {
      setErrors((prev) => ({ ...prev, expiryDate: 'Expiry date must be in MM/YY format' }));
    } else if (month < 1 || month > 12) {
      setErrors((prev) => ({ ...prev, expiryDate: 'Invalid month' }));
    } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      setErrors((prev) => ({ ...prev, expiryDate: 'Card is expired' }));
    } else if (parseInt(year) > currentYear + 4 || (parseInt(year) === currentYear + 4 && parseInt(month) < currentMonth)) {
      setErrors((prev) => ({ ...prev, expiryDate: 'Expiry date cannot be more than 4 years' }));
    } else {
      setErrors((prev) => ({ ...prev, expiryDate: '' }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);

    if (value.length !== 3) {
      setErrors((prev) => ({ ...prev, cvv: 'CVV must be 3 digits' }));
    } else {
      setErrors((prev) => ({ ...prev, cvv: '' }));
    }
  };


  const handleConfirmPayment = async () => {
    const newErrors = {};
  
    // Validate card type
    if (!cardType) {
      newErrors.cardType = 'Payment option is required';
    }
  
    // Validate card details if not Cash on Delivery
    if (cardType !== 'Cash on Delivery') {
      const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
      
      // Card Number Validation
      if (!cleanedCardNumber || !/^\d{16}$/.test(cleanedCardNumber)) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      } else {
      }
  
    // Expiry Date Validation
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card is expired';
      } else if (parseInt(year) > currentYear + 4 || (parseInt(year) === currentYear + 4 && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Expiry date cannot be more than 4 years';
      }
    }

  
      // CVV Validation
      if (!cvv || !/^\d+$/.test(cvv)) {
        newErrors.cvv = 'CVV must be numeric';
      }  else if (!/^\d{3}$/.test(cvv)) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    console.log('Payment confirmed with details:', {
      cardType,
      cardNumber,
      expiryDate,
      cvv,
      ...paymentDetails,
    });
  
    const paymentData = {
      ...paymentDetails,
      cardType,
      cardNumber: cardNumber.replace(/\s+/g, ''),
      expiryDate,
      cvv,
      email
    };
  
    try {
      const response = await axios.post('http://localhost:3002/payment/add-payment/', paymentData);
      console.log('Payment response:', response.data);
  
      Swal.fire({
        title: 'Success!',
        text: 'You have successfully paid the order amount.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/home-page'); 
      });
  
    } catch (error) {
      console.error('Error submitting payment:', error);
  
      Swal.fire({
        title: 'Error!',
        text: 'There was an error processing your payment. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  

  return (
    <PageContainer>
      <Navbar /> {/* Add the Navbar here */}
      <PaymentPageContainer>
        <PaymentForm>
          <h1 style={{ textAlign: 'center', marginTop: '0px' }}>Payment Details</h1>
          <FormField>
            <FormLabel>Payment Option</FormLabel>
            <RadioGroup>
              <CardOption>
                <input
                  type="radio"
                  id="visa"
                  name="cardType"
                  value="Visa"
                  checked={cardType === 'Visa'}
                  onChange={(e) => {
                    setCardType(e.target.value);
                    setErrors({ ...errors, cardType: '' }); // Clear the error on change
                  }}
                />
                <CardImage src="https://bd.visa.com/dam/VCOM/regional/ap/bangladesh/global-elements/images/bd-visa-gold-card-498x280.png" alt="Visa" />
                <label htmlFor="visa">Visa</label>
              </CardOption>
              <CardOption>
                <input
                  type="radio"
                  id="mastercard"
                  name="cardType"
                  value="MasterCard"
                  checked={cardType === 'MasterCard'}
                  onChange={(e) => {
                    setCardType(e.target.value);
                    setErrors({ ...errors, cardType: '' }); // Clear the error on change
                  }}
                />
                <CardImage src="https://w7.pngwing.com/pngs/92/785/png-transparent-mastercard-logo-mastercard-credit-card-payment-visa-nyse-ma-mastercard-logo-text-logo-sign.png" alt="MasterCard" />
                <label htmlFor="mastercard">MasterCard</label>
              </CardOption>
              <CardOption>
                <input
                  type="radio"
                  id="amex"
                  name="cardType"
                  value="American Express"
                  checked={cardType === 'American Express'}
                  onChange={(e) => {
                    setCardType(e.target.value);
                    setErrors({ ...errors, cardType: '' }); // Clear the error on change
                  }}
                />
                <CardImage src="https://www.storefrontdirect.com/pub/media/catalog/product/cache/8c0cd180e440eae853fa2176b62a6ddf/a/m/amexcr80.png" alt="American Express" />
                <label htmlFor="amex">American Express</label>
              </CardOption>
              <CardOption>
                <input
                  type="radio"
                  id="cod"
                  name="cardType"
                  value="Cash on Delivery"
                  checked={cardType === 'Cash on Delivery'}
                  onChange={(e) => {
                    setCardType(e.target.value);
                    setErrors({ ...errors, cardType: '' }); // Clear the error on change
                  }}
                />
                                <CardImage src="https://t3.ftcdn.net/jpg/06/04/86/68/360_F_604866832_5i9b2mnlQV1Ocgn6OQes0NsANhEEGW95.jpg" alt="Cash on Delivery" />
                <label htmlFor="cod">Cash on Delivery</label>
              </CardOption>
            </RadioGroup>
            {errors.cardType && <ErrorMessage>{errors.cardType}</ErrorMessage>}
          </FormField>
          {cardType !== 'Cash on Delivery' && (
            <>
          <FormField>
            <FormLabel>Card Number</FormLabel>
            <FormInput
              type="text"
              value={cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()} // Format the card number as XXXX XXXX XXXX XXXX
              onChange={handleCardNumberChange}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19} // Account for the spaces (16 digits + 3 spaces)
            />
            {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
          </FormField>

          <FormField>
          <FormLabel>Expiry Date (MM/YY)</FormLabel>
          <FormInput
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength={5} 
          />
          {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
        </FormField>

        <FormField>
        <FormLabel>CVV</FormLabel>
        <FormInput
          type="text"
          value={cvv}
          onChange={handleCvvChange}
          placeholder="123"
          maxLength={3} 
        />
        {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
      </FormField>
            </>
          )}
          <FormField>
            <FormLabel>Payment Confirmation Email</FormLabel>
            <FormInput
              disabled
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
            />
          </FormField>
          <ButtonRow>
            <BackButtonStyled onClick={() => navigate(-1)}>Back</BackButtonStyled>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
            </Button>
          </ButtonRow>
        </PaymentForm>
      </PaymentPageContainer>
    </PageContainer>
  );
};

export default PaymentPage;
