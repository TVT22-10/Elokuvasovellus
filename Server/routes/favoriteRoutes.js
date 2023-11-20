// favoritesRoutes.js
const express = require('express');
const router = express.Router();
const favoritesController = require('../postgre/favorites');

// Define routes for handling favorites
router.get('/:username', favoritesController.getFavorites);
router.post('/:username/add', favoritesController.addToFavorites);
router.delete('/:username/remove/:movieId', favoritesController.removeFromFavorites);

module.exports = router;
