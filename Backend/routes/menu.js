// routes/menu.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Add a new menu item
router.post('/add-menu-item/', menuController.addNewMenuItem);

// Delete a menu item
router.delete('/delete-menu-item/:id', menuController.deleteMenuItem);

// Get all menu items
router.get('/get-menu-items/', menuController.getAllMenuItems);

// Get a single menu item
router.get('/get-menu-item/:id', menuController.getMenuItemById);

// Update a menu item
router.put('/update-menu-item/:id', menuController.updateMenuItem);

// Get category count
router.get('/category-counts', menuController.getCategoryCounts);

module.exports = router;
