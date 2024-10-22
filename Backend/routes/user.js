const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware'); // JWT authentication middleware

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get user profile (protected route)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Forgot password route
router.post('/forgot-password', userController.forgotPassword);

// Reset password route
router.post('/reset-password/:resetToken', userController.resetPassword);

router.get('/get-users', userController.getAllUsers);

// Route to get a single user by ID
router.get('/user/:id', userController.getUserById);

// Route to update a user by ID
router.put('/user/:id', userController.updateUser);

// Route to delete a user by ID (protected route)
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
