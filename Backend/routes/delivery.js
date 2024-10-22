// routes/delivery.js
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Add a new delivery
router.post('/add-delivery/', deliveryController.addNewDelivery);

// Delete a delivery
router.delete('/delete-delivery/:id', deliveryController.deleteDelivery);

// Get all deliveries
router.get('/get-deliveries/', deliveryController.getAllDeliveries);

// Get a single delivery
router.get('/get-delivery/:id', deliveryController.getDeliveryById);

// Update a delivery
router.put('/update-delivery/:id', deliveryController.updateDelivery);

// Get deliveries by district
router.get('/deliveries-by-district/:district', deliveryController.getDeliveriesByDistrict);

// Other routes
router.get('/delivery/latest-id', deliveryController.getLatestDeliveryId);
  

module.exports = router;
