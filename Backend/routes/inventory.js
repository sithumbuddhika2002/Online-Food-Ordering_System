const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Add a new inventory item
router.post('/add-inventory-item/', inventoryController.addNewInventoryItem);

// Delete an inventory item
router.delete('/delete-inventory-item/:id', inventoryController.deleteInventoryItem);

// Get all inventory items
router.get('/get-inventory-items/', inventoryController.getAllInventoryItems);

// Get a single inventory item
router.get('/get-inventory-item/:id', inventoryController.getInventoryItemById);

// Update an inventory item
router.put('/update-inventory-item/:id', inventoryController.updateInventoryItem);

module.exports = router;
