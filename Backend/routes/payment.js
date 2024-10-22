const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Add a new payment record
router.post('/add-payment/', paymentController.addNewPayment);

// Delete a payment record
router.delete('/delete-payment/:id', paymentController.deletePayment);

// Get all payment records
router.get('/get-payments/', paymentController.getAllPayments);

// Get a single payment record by ID
router.get('/get-payment/:id', paymentController.getPaymentById);

// Update a payment record
router.put('/update-payment/:id', paymentController.updatePayment);

module.exports = router;
