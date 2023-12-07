// favoritesRoutes.js
const express = require('express');
const router = express.Router();
const favoritesController = require('../postgre/favorites');

// Define routes for handling favorites

router.get('/top-favorites', favoritesController.getTopUsersByFavorites);

router.get('/:username', favoritesController.getFavorites);
router.post('/:username/add', favoritesController.addToFavorites);
router.delete('/:username/remove/:movieId', favoritesController.removeFromFavorites);


// New route to check if a movie is a favorite
router.get('/:username/check', favoritesController.checkFavorite);

module.exports = router;
