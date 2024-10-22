const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total Price must be a positive number'],
  },
  deliveryDistrict: {
    type: String,
    required: true,
  },
  deliveryId: {
    type: String, 
    ref: 'Delivery', 
    required: true,
  },
  cardType: {
    type: String,
    enum: ['Visa', 'MasterCard', 'American Express', 'Cash On Delivery'],
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    minlength: 13,
    maxlength: 19, 
  },
  expiryDate: {
    type: String,
    required: true,
    match: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, 
  },
  cvv: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 4,
  },
}, {
  timestamps: true, 
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
