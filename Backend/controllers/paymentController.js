const Payment = require('../models/paymentModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); 

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

// Function to send email
const sendSuccessEmail = (email, paymentDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Payment Successful',
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="text-align: center; color: #4CAF50;">Payment Successful</h2>
                <p>Dear ${paymentDetails.firstName},</p>
                <p>Thank you for your payment! We’re happy to let you know that your payment was successful.</p>
                <h3>Payment Details:</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Full Name:</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${paymentDetails.firstName} ${paymentDetails.lastName}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Card Type:</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${paymentDetails.cardType}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Amount Paid:</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Rs ${paymentDetails.totalPrice}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Transaction ID:</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${paymentDetails.deliveryId.substring(0,5)}</td>
                  </tr>
                </table>
                <p>If you have any questions, feel free to contact us.</p>
                <p>Thank you for your purchase!</p>
                <p style="text-align: center; color: #999;">Best regards,<br>Land of Kings</p>
              </div>
            </body>
          </html>
        `,
    };

    return transporter.sendMail(mailOptions);
};
// Add a new payment record
exports.addNewPayment = async (req, res) => {
    try {
        const { firstName, lastName, totalPrice, deliveryDistrict, deliveryId, cardType, cardNumber, expiryDate, cvv, email } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each field and push to missingFields array if not provided
        if (!firstName) missingFields.push("firstName");
        if (!lastName) missingFields.push("lastName");
        if (!totalPrice) missingFields.push("totalPrice");
        if (!deliveryDistrict) missingFields.push("deliveryDistrict");
        if (!deliveryId) missingFields.push("deliveryId");
        if (!cardType) missingFields.push("cardType");
        if (!cardNumber) missingFields.push("cardNumber");
        if (!expiryDate) missingFields.push("expiryDate");
        if (!cvv) missingFields.push("cvv");
        if (!email) missingFields.push("email");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        const newPayment = new Payment({
            firstName,
            lastName,
            totalPrice,
            deliveryDistrict,
            deliveryId,
            cardType,
            cardNumber,
            expiryDate,
            cvv
        });

        await newPayment.save();
        
        // Send success email
        await sendSuccessEmail(email, {
            firstName,
            lastName,
            totalPrice,
            deliveryDistrict,
            deliveryId,
            cardType,
            cardNumber,
            expiryDate,
            cvv
        });

        res.status(201).json({ message: "New payment record added successfully and email sent!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete a payment record
exports.deletePayment = (req, res) => {
    const paymentId = req.params.id;

    // Validate paymentId
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return res.status(400).json({ message: "Invalid payment ID" });
    }

    Payment.deleteOne({ _id: paymentId })
        .then(() => {
            res.status(200).send({ status: "Payment record deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete payment record", error: err.message });
        });
};

// Get all payment records
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single payment record by ID
exports.getPaymentById = async (req, res) => {
    const { id } = req.params;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid payment ID" });
    }

    try {
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ message: "Payment record not found!" });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a payment record
exports.updatePayment = async (req, res) => {
    const paymentId = req.params.id;
    const { firstName, lastName, totalPrice, deliveryDistrict, deliveryId, cardType, cardNumber, expiryDate, cvv } = req.body;

    // Validate inputs
    if (!(firstName && lastName && totalPrice && deliveryDistrict && deliveryId && cardType && cardNumber && expiryDate && cvv)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Check if paymentId and deliveryId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return res.status(400).send({ message: "Invalid payment ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
        return res.status(400).send({ message: "Invalid delivery ID" });
    }

    try {
        // Check if the payment record exists in the database
        const isPayment = await Payment.findById(paymentId);

        if (!isPayment) {
            return res.status(404).json({ message: "Payment record not found!" });
        }

        // Update the payment record
        const result = await Payment.updateOne(
            { _id: paymentId },
            {
                firstName,
                lastName,
                totalPrice,
                deliveryDistrict,
                deliveryId,
                cardType,
                cardNumber,
                expiryDate,
                cvv,
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Payment record updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};
