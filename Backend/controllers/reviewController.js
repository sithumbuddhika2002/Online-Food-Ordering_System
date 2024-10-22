const Review = require("../models/reviewModel");
const Menu = require("../models/menuModel");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { menuItemId, review, rating, userId } = req.body;

    // Validate input fields
    if (!(menuItemId && review && rating)) {
      return res.status(400).json({ message: "All inputs are required" });
    }

    // Check if menuItemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    // Find the menu item by ID
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found!" });
    }

    // Create new review with user attribute and default status
    const newReview = new Review({
      menuItem: menuItemId,
      foodName: menuItem.menuItemName,
      servingSize: menuItem.servingSize,
      price: menuItem.price,
      review,
      rating,
      status: 'pending', 
      user: userId 
    });

    // Save the review
    await newReview.save();

    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    // Check if reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Delete the review by ID
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found!" });
    }

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('menuItem', 'menuItemName category').populate('user', 'firstName emailAddress'); // Populate user info
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find review by ID and populate related menuItem and user fields
    const review = await Review.findById(id)
      .populate('menuItem', 'menuItemName category menuImage')  // Populate menuItem details
      .populate('user', 'firstName');  // Populate user details

    // Handle case where no review is found
    if (!review) {
      return res.status(404).json({ message: "Review not found!" });
    }

    // Return the review in the response
    return res.json(review);
    
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching review by ID:", error.message);
    
    // Send a 500 status with the error message
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};



// Update a review (includes the new status field)
exports.updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { review, rating, status } = req.body;

  // Validate inputs
  if (!(review && rating)) {
    return res.status(400).send({ message: "Review and rating are required" });
  }

  // Check if reviewId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).send({ message: "Invalid review ID" });
  }

  try {
    // Check if the review exists in the database
    const isReview = await Review.findById(reviewId);
    if (!isReview) {
      return res.status(404).json({ message: "Review not found!" });
    }

    // Update the review and status
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId, 
      { review, rating, status }, // Include status in the update
      { new: true }
    );

    return res.status(200).json({ message: "Review updated successfully!", updatedReview });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: err.message });
  }
};

// Get reviews by menu item ID
exports.getReviewsByMenuItemId = async (req, res) => {
  const { menuItemId } = req.params;

  try {
    // Check if menuItemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    const reviews = await Review.find({ menuItem: menuItemId })
      .populate('menuItem', 'menuItemName category price servingSize')
      .populate('user', 'firstName'); // Populate user info
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this menu item!" });
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a transporter for nodemailer (this example uses Gmail, but you can use other services)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  },
});

// Approve a review and send an email notification
exports.approveReview = async (req, res) => {
  const reviewId = req.params.id; // Extract reviewId from request parameters

  try {
    // Check if reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find the review and populate the user information
    const review = await Review.findById(reviewId).populate('user', 'emailAddress firstName');
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review's status to 'approved'
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status: 'approved' },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Send email notification to the user
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (use the same email as in transporter)
      to: review.user.emailAddress, // User's email address
      subject: 'Your Review has been Approved!',
      text: `Hello ${review.user.firstName},\n\nYour review for the menu item "${review.foodName}" has been approved and is now published on the menu page.\n\nThank you for your review!\n\nBest regards,\nLand of Kings`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Review approved but email failed to send', error });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: "Review approved and email sent to the user!", updatedReview });
      }
    });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ message: 'Error approving review', error });
  }
};

// Flag a review
exports.flagReview = async (req, res) => {
  const reviewId = req.params.id; // Extract reviewId from request parameters
  try {
    // Check if reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find the review and populate the user information
    const review = await Review.findById(reviewId).populate('user', 'emailAddress firstName');
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review's status to 'flagged'
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status: 'flagged' },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Send email notification to the user
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (use the same email as in transporter)
      to: review.user.emailAddress, // User's email address
      subject: 'Your Review has been Flagged!',
      text: `Hello ${review.user.firstName},\n\nYour review for the menu item "${review.foodName}" has been flagged for review.\n\nOur team will look into it shortly.\n\nThank you for your understanding!\n\nBest regards,\nLand of Kings`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Review flagged but email failed to send', error });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: "Review flagged and email sent to the user!", updatedReview });
      }
    });
  } catch (error) {
    console.error("Error flagging review:", error);
    res.status(500).json({ message: 'Error flagging review', error });
  }
};

