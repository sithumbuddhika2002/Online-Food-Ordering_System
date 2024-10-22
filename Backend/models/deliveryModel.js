const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true,
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
  city: {
    type: String,
    required: true,
  },
  deliveryDistrict: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsappNo: {
    type: String,
  },
  orderNotes: {
    type: String,
  },
  orderedItems: [{
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending', 
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
