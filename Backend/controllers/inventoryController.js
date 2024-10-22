const Inventory = require("../models/inventoryModel");
const mongoose = require('mongoose'); 
const nodemailer = require("nodemailer");

require('dotenv').config();

// Email configuration for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

// Add a new inventory item
exports.addNewInventoryItem = async (req, res) => {
    try {
        const {
            itemId,
            itemName,
            category,
            description,
            unitOfMeasure,
            quantityInStock,
            reorderLevel,
            reorderQuantity,
            supplierId,
            costPrice,
            dateAdded,
            lastRestockedDate,
            expirationDate,
            brand,
            locationInStore,
            stockStatus
        } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each field and push to missingFields array if not provided
        if (!itemId) missingFields.push("itemId");
        if (!itemName) missingFields.push("itemName");
        if (!category) missingFields.push("category");
        if (!description) missingFields.push("description");
        if (!unitOfMeasure) missingFields.push("unitOfMeasure");
        if (!quantityInStock) missingFields.push("quantityInStock");
        if (!reorderLevel) missingFields.push("reorderLevel");
        if (!reorderQuantity) missingFields.push("reorderQuantity");
        if (!supplierId) missingFields.push("supplierId");
        if (!costPrice) missingFields.push("costPrice");
        if (!stockStatus) missingFields.push("stockStatus");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "The following fields are required",
                missingFields
            });
        }

        const newInventoryItem = new Inventory({
            itemId,
            itemName,
            category,
            description,
            unitOfMeasure,
            quantityInStock,
            reorderLevel,
            reorderQuantity,
            supplierId,
            costPrice,
            dateAdded: dateAdded || Date.now(),
            lastRestockedDate,
            expirationDate,
            brand,
            locationInStore,
            stockStatus
        });

        await newInventoryItem.save();

        // Send success message and added item details to the admin email
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: 'New Inventory Item Added',
            html: `
                <h2>New Inventory Item Added</h2>
                <p>A new item has been added to the inventory. Below are the details:</p>
                <ul>
                    <li><strong>Item ID:</strong> ${newInventoryItem.itemId}</li>
                    <li><strong>Item Name:</strong> ${newInventoryItem.itemName}</li>
                    <li><strong>Category:</strong> ${newInventoryItem.category}</li>
                    <li><strong>Description:</strong> ${newInventoryItem.description}</li>
                    <li><strong>Unit of Measure:</strong> ${newInventoryItem.unitOfMeasure}</li>
                    <li><strong>Quantity in Stock:</strong> ${newInventoryItem.quantityInStock}</li>
                    <li><strong>Reorder Level:</strong> ${newInventoryItem.reorderLevel}</li>
                    <li><strong>Reorder Quantity:</strong> ${newInventoryItem.reorderQuantity}</li>
                    <li><strong>Supplier ID:</strong> ${newInventoryItem.supplierId}</li>
                    <li><strong>Cost Price:</strong> ${newInventoryItem.costPrice}</li>
                    <li><strong>Date Added:</strong> ${new Date(newInventoryItem.dateAdded).toLocaleDateString()}</li>
                    <li><strong>Last Restocked Date:</strong> ${new Date(newInventoryItem.lastRestockedDate).toLocaleDateString()}</li>
                    <li><strong>Expiration Date:</strong> ${new Date(newInventoryItem.expirationDate).toLocaleDateString()}</li>
                    <li><strong>Brand:</strong> ${newInventoryItem.brand}</li>
                    <li><strong>Location in Store:</strong> ${newInventoryItem.locationInStore}</li>
                    <li><strong>Stock Status:</strong> ${newInventoryItem.stockStatus}</li>
                </ul>
                <p>Please review the item details in the inventory management system.</p>
            `
        };

        // Send the email
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('Error while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });

        res.status(201).json({ message: "New inventory item added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete an inventory item
exports.deleteInventoryItem = (req, res) => {
    const itemId = req.params.id;

    Inventory.deleteOne({ _id: itemId })
        .then(() => {
            res.status(200).send({ status: "Inventory item deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with deleting inventory item", error: err.message });
        });
};

// Get all inventory items
exports.getAllInventoryItems = async (req, res) => {
    try {
        const inventoryItems = await Inventory.find();
        res.json(inventoryItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single inventory item by ID
exports.getInventoryItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) return res.status(404).json({ message: "Inventory item not found!" });
        res.json(inventoryItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
    const itemId = req.params.id;
    const {
        itemName,
        category,
        description,
        unitOfMeasure,
        quantityInStock,
        reorderLevel,
        reorderQuantity,
        supplierId,
        costPrice,
        lastRestockedDate,
        expirationDate,
        brand,
        locationInStore,
        stockStatus
    } = req.body;

    // Validate inputs
    if (!(itemName && category && description && unitOfMeasure && quantityInStock && reorderLevel && reorderQuantity && supplierId && costPrice && stockStatus)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).send({ message: "Invalid inventory item ID" });
    }

    try {
        // Check if the inventory item exists in the database
        const isInventoryItem = await Inventory.findById(itemId);

        if (!isInventoryItem) {
            return res.status(404).json({ message: "Inventory item not found!" });
        }

        // Update the inventory item
        const result = await Inventory.updateOne(
            { _id: itemId },
            {
                itemName,
                category,
                description,
                unitOfMeasure,
                quantityInStock,
                reorderLevel,
                reorderQuantity,
                supplierId,
                costPrice,
                lastRestockedDate,
                expirationDate,
                brand,
                locationInStore,
                stockStatus,
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Inventory item updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

// Get category counts for inventory
exports.getInventoryCategoryCounts = async (req, res) => {
    try {
        // Aggregate the count of inventory items by category
        const categoryCounts = await Inventory.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        // If there are no counts, return an empty object
        if (!categoryCounts.length) {
            return res.json({ message: "No categories found" });
        }

        res.json(categoryCounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
