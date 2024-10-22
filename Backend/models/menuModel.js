// models/menuModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  menuItemId: {
    type: String,
    required: true,
    unique: true,
  },
  menuItemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: Number,
    required: true,
  },
  servingSize: {
    type: String,
    required: true,
  },
  menuImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
