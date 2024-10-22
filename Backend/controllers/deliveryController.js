const Delivery = require("../models/deliveryModel");
const mongoose = require('mongoose');

// Add a new delivery
exports.addNewDelivery = async (req, res) => {
  try {
    const { 
      firstName, lastName, address, city, deliveryDistrict, deliveryDate, phone, email, whatsappNo, orderNotes, orderedItems, totalPrice 
    } = req.body;

    // Log the received data for debugging
    console.log(req.body);

    // Create an array to hold error messages for missing fields
    const missingFields = [];

    // Check each field and push to missingFields array if not provided
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!deliveryDistrict) missingFields.push("deliveryDistrict");
    if (!deliveryDate) missingFields.push("deliveryDate");
    if (!phone) missingFields.push("phone");
    if (!email) missingFields.push("email");
    if (!orderedItems || orderedItems.length === 0) missingFields.push("orderedItems");
    if (totalPrice == null) missingFields.push("totalPrice");

    // If there are any missing fields, return a detailed message
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "The following fields are required", 
        missingFields 
      });
    }

    // Generate a unique deliveryId
    const { v4: uuidv4 } = require('uuid');

    // Generate a unique deliveryId
    const deliveryId = uuidv4();

    const newDelivery = new Delivery({
      deliveryId,
      firstName,
      lastName,
      address,
      city,
      deliveryDistrict,
      deliveryDate,
      phone,
      email,
      whatsappNo,
      orderNotes,
      orderedItems,
      totalPrice,
      status: 'Pending' // Default status
    });

    await newDelivery.save();
    res.status(201).json({ message: "New delivery added successfully!", deliveryId });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: err.message });
  }
};

// Delete a delivery
exports.deleteDelivery = (req, res) => {
  const deliveryId = req.params.id;

  // Check if deliveryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    return res.status(400).send({ message: "Invalid delivery ID" });
  }

  Delivery.deleteOne({ _id: deliveryId })
    .then(() => {
      res.status(200).send({ status: "Delivery deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with delete delivery", error: err.message });
    });
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single delivery
exports.getDeliveryById = async (req, res) => {
  const { id } = req.params;

  // Check if deliveryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid delivery ID" });
  }

  try {
    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found!" });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a delivery
exports.updateDelivery = async (req, res) => {
  const deliveryId = req.params.id;
  const { 
    firstName, lastName, address, city, deliveryDistrict, deliveryDate, phone, email, whatsappNo, orderNotes, orderedItems, totalPrice, status 
  } = req.body;

  // Validate inputs
  if (!(firstName && lastName && address && city && deliveryDistrict && deliveryDate && phone && email && orderedItems && totalPrice != null && status)) {
    return res.status(400).send({ message: "All required inputs are needed" });
  }

  // Check if deliveryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    return res.status(400).send({ message: "Invalid delivery ID" });
  }

  try {
    // Check if the delivery exists in the database
    const isDelivery = await Delivery.findById(deliveryId);

    if (!isDelivery) {
      return res.status(404).json({ message: "Delivery not found!" });
    }

    // Update the delivery
    const result = await Delivery.updateOne(
      { _id: deliveryId },
      {
        firstName,
        lastName,
        address,
        city,
        deliveryDistrict,
        deliveryDate,
        phone,
        email,
        whatsappNo,
        orderNotes,
        orderedItems,
        totalPrice,
        status
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    return res.status(200).json({ message: "Delivery updated successfully!" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: err.message });
  }
};

// Get deliveries by district
exports.getDeliveriesByDistrict = async (req, res) => {
  const { district } = req.params;

  try {
    const deliveries = await Delivery.find({ deliveryDistrict: district });

    if (!deliveries.length) {
      return res.status(404).json({ message: "No deliveries found for this district!" });
    }

    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get deliveries by status
exports.getDeliveriesByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const deliveries = await Delivery.find({ status });

    if (!deliveries.length) {
      return res.status(404).json({ message: `No deliveries found with status: ${status}` });
    }

    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get latest delivery ID
exports.getLatestDeliveryId = async (req, res) => {
  try {
    const latestDelivery = await Delivery.findOne().sort({ deliveryId: -1 }); // Assuming deliveryId is stored in the database
    const latestId = latestDelivery ? latestDelivery.deliveryId : 0;
    res.json({ latestId });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the latest delivery ID', error });
  }
};
