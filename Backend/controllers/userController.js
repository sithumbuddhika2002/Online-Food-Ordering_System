const User = require('../models/userModel'); // Import the user model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('../services/emailService');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { title, firstName, lastName, address, NIC, DOB, contact, emailAddress, city, district, password, confirmPassword } = req.body;

    // Check if email or NIC already exists
    const existingUser = await User.findOne({ $or: [{ emailAddress }, { NIC }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or NIC already exists.' });
    }

    // Create new user
    const newUser = new User({
      title,
      firstName,
      lastName,
      address,
      NIC,
      DOB,
      contact,
      emailAddress,
      city,
      district,
      password,
      confirmPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailAddress: newUser.emailAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate a reset token
const generateResetToken = async () => {
  return crypto.randomBytes(16).toString('hex');
};

exports.forgotPassword = async (req, res) => {
  try {
    const { emailAddress } = req.body;

    // Check if the user exists with the provided email
    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email address exists.' });
    }

    // Generate reset token
    const resetToken = await generateResetToken();
    console.log('Generated Reset Token:', resetToken);

    // Set token and expiration on the user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the reset token and expiry time
    await user.save();

    // Prepare the reset URL and email message
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `
      You are receiving this because you have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n
    `;

    // Send the email
    try {
      await sendEmail(user.emailAddress, 'Password Reset', message);
      res.json({ message: 'A reset email has been sent to your email address.' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save(); 
      return res.status(500).json({ message: 'Error sending reset email. Please try again later.' });
    }

  } catch (error) {
    console.error('Error processing password reset request:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    // Find the user by the reset token and check if it's still valid
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token should not be expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // Special condition for admin login
    if (emailAddress === 'admin@gmail.com' && password === 'admin') {
      // Generate a token for the admin
      const adminToken = jwt.sign({ email: emailAddress, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Send the admin-specific response
      return res.json({
        message: 'Admin login successful',
        token: adminToken,
        user: {
          firstName: 'Admin',
          lastName: '',
          emailAddress: 'admin@gmail.com',
          role: 'admin',  
        },
        redirect: '/view-users', 
      });
    }

    // Find user by email
    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.emailAddress }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await User.findById(userId).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const updates = req.body; 

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    Object.keys(updates).forEach(key => {
      if (key !== 'password') { 
        user[key] = updates[key];
      }
    });

    // If the password is being updated, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updates.password, salt);
    }

    // Save the updated user
    await user.save();

    res.json({
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; 

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
