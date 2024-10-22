// models/inventoryModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Vegetables',
      'Fruits',
      'Meats',
      'Seafood',
      'Dairy',
      'Beverages',
      'Grains',
      'Spices and Herbs',
      'Bakery Products',
      'Condiments and Sauces',
      'Snacks',
      'Frozen Foods',
      'Canned Goods',
      'Packaging Materials',
      'Cleaning Supplies'
    ],
  },
  description: {
    type: String,
    required: true,
  },
  unitOfMeasure: {
    type: String,
    required: true,
    enum: [
      'Piece',        
      'Kilogram (kg)',
      'Gram (g)',     
      'Liter (L)',    
      'Milliliter (mL)', 
      'Dozen',        
      'Pack',         
      'Box',          
      'Bag',          
      'Can',          
      'Jar',          
      'Pound (lb)',   
      'Ounce (oz)',   
      'Cup',         
      'Spoon'         
    ]
  },
  quantityInStock: {
    type: Number,
    required: true,
  },
  reorderLevel: {
    type: Number,
    required: true,
  },
  reorderQuantity: {
    type: Number,
    required: true,
  },
  supplierId: {
    type: String,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastRestockedDate: {
    type: Date,
    required: false,
  },
  expirationDate: {
    type: Date,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  locationInStore: {
    type: String,
    enum: ['Kaduwela', 'Malabe', 'Kiribathgoda', 'Kadawatha', 'Ja-Ela'],
    required: false,
  },
  
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Low Stock'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
