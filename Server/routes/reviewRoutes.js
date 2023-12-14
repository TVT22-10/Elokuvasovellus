const express = require('express');
const router = express.Router();
const { addReview, getAllReviews, getReviewsByRating, getReviewsByMovieId, getReviewsByUsername, getTopReviewers } = require('../postgre/Review');

router.post('/', addReview);
router.get('/', getAllReviews);
router.get('/user/:username', getReviewsByUsername); // Move this line up
router.get('/:minRating/:maxRating', getReviewsByRating);
router.get('/top-reviewers', getTopReviewers);
router.get('/:movieId', getReviewsByMovieId); // Keep this line last



module.exports = router;
