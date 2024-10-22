const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create the schema for user registration
const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'], 
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  NIC: {
    type: String,
    required: true,
    unique: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true, 
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], 
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  // Add fields for password reset functionality
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
    const user = this;
  
    // If the password is modified or new, hash it
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  
    next();
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;
