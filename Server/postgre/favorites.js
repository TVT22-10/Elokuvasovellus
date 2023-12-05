const pgPool = require('./connection'); // Adjust the path based on your actual file structure
const axios = require('axios');

const getFavorites = async (req, res) => {
  const { username } = req.params;
  try {
    const favoritesResult = await pgPool.query('SELECT movie_id FROM favorites WHERE username = $1', [username]);
    
    const movieDetailsPromises = favoritesResult.rows.map(row =>
      axios.get(`http://localhost:3001/movies/${row.movie_id}`) // Use your existing route
    );

    const moviesDetails = await Promise.all(movieDetailsPromises);
    const movies = moviesDetails.map(response => response.data);

    res.json(movies);
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const addToFavorites = async (req, res) => {
  const { username } = req.params;  // Extracting username from URL parameters
  const { movieId } = req.body; 


  try {
    await pgPool.query('INSERT INTO favorites (username, movie_id) VALUES ($1, $2)', [username, movieId]);
    res.json({ message: 'Movie added to favorites successfully' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeFromFavorites = async (req, res) => {
  const { username, movieId } = req.params;

  try {
    await pgPool.query('DELETE FROM favorites WHERE username = $1 AND movie_id = $2', [username, movieId]);
    res.json({ message: 'Movie removed from favorites successfully' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const checkFavorite = async (req, res) => {
  const { username } = req.params;
  const { movieId } = req.query; // Assuming movieId is passed as a query parameter

  try {
    const result = await pgPool.query('SELECT * FROM favorites WHERE username = $1 AND movie_id = $2', [username, movieId]);

    // If the query returns a row, it means the movie is a favorite
    const isFavorite = result.rows.length > 0;
    
    res.json({ isFavorite: isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTopUsersByFavorites = async (req, res) => {
  try {
    const result = await pgPool.query(
      'SELECT f.username, c.avatar, COUNT(f.id) as favorite_count ' +
      'FROM favorites f ' +
      'JOIN customer c ON f.username = c.username ' +
      'GROUP BY f.username, c.avatar ' +
      'ORDER BY favorite_count DESC ' +
      'LIMIT 5'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting top users by favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = { getFavorites, addToFavorites, removeFromFavorites,checkFavorite, getTopUsersByFavorites };