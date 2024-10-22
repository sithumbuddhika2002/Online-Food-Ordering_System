// routes/review.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Add a new review
router.post('/add-review/', reviewController.addReview);

// Delete a review
router.delete('/delete-review/:id', reviewController.deleteReview);

// Get all reviews
router.get('/get-reviews/', reviewController.getAllReviews);

// Get a single review
router.get('/get-review/:id', reviewController.getReviewById);

// Update a review
router.put('/update-review/:id', reviewController.updateReview);

// Get reviews by menu item ID
router.get('/get-reviews-by-menu/:menuItemId', reviewController.getReviewsByMenuItemId);

// Route to update review status
router.put('/update-review-status/:id', (req, res) => {
    const status = req.body.status; // Get the status from the request body
    if (status === 'approved') {
      return reviewController.approveReview(req, res);
    } else if (status === 'flagged') {
      return reviewController.flagReview(req, res);
    } else {
      return res.status(400).json({ message: 'Invalid status' });
    }
  });

module.exports = router;
