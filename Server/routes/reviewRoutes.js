const express = require('express');
const router = express.Router();
const { addReview, getAllReviews, getReviewsByRating, getReviewsByMovieId } = require('../postgre/Review');

router.post('/', addReview);
router.get('/', getAllReviews);
router.get('/:minRating/:maxRating', getReviewsByRating);
router.get('/:movieId', getReviewsByMovieId); // New route for fetching reviews by movie ID

module.exports = router;
