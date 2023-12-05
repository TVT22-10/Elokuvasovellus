const pgPool = require('./connection');

const addReview = async (req, res) => {
  const { username, movieId, rating, reviewText } = req.body;

  try {
    const result = await pgPool.query(
      'INSERT INTO reviews (username, movie_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, movieId, rating, reviewText]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllReviews = async (req, res) => {
  const { sort } = req.query; // Extract the sort parameter from the query

  try {
    let result;

    // Check the sort parameter and apply sorting accordingly
    switch (sort) {
      case 'newest':
        result = await pgPool.query(
          'SELECT r.*, c.avatar FROM reviews r JOIN customer c ON r.username = c.username ORDER BY r.review_date DESC'
        );
        break;
      case 'oldest':
        result = await pgPool.query(
          'SELECT r.*, c.avatar FROM reviews r JOIN customer c ON r.username = c.username ORDER BY r.review_date ASC'
        );
        break;
      case 'best':
        result = await pgPool.query(
          'SELECT r.*, c.avatar FROM reviews r JOIN customer c ON r.username = c.username ORDER BY r.rating DESC'
        );
        break;
      case 'worst':
        result = await pgPool.query(
          'SELECT r.*, c.avatar FROM reviews r JOIN customer c ON r.username = c.username ORDER BY r.rating ASC'
        );
        break;
      default:
        // Default to ordering by the newest
        result = await pgPool.query(
          'SELECT r.*, c.avatar FROM reviews r JOIN customer c ON r.username = c.username ORDER BY r.review_date DESC'
        );
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getReviewsByRating = async (req, res) => {
  const { minRating, maxRating } = req.params;

  try {
    const result = await pgPool.query('SELECT * FROM reviews WHERE rating >= $1 AND rating <= $2', [
      minRating,
      maxRating,
    ]);

    res.json(result.rows); // Check if result.rows is not undefined before sending
  } catch (error) {
    console.error('Error getting reviews by rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getReviewsByMovieId = async (req, res) => {
  const { movieId } = req.params;

  try {
    const result = await pgPool.query(
      'SELECT r.*, c.avatar FROM reviews r JOIN customer c ON r.username = c.username WHERE r.movie_id = $1',
      [movieId]
    );

    res.json(result.rows); // Check if result.rows is not undefined before sending
  } catch (error) {
    console.error('Error getting reviews by movie ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getReviewsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pgPool.query(
      'SELECT review_id, movie_id, rating, review_text, review_date FROM reviews WHERE username = $1',[username]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting reviews by username:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTopReviewers = async (req, res) => {
  try {
    const result = await pgPool.query(
      'SELECT r.username, c.avatar, COUNT(r.review_id) as review_count ' +
      'FROM reviews r ' +
      'JOIN customer c ON r.username = c.username ' +
      'GROUP BY r.username, c.avatar ' +
      'ORDER BY review_count DESC ' +
      'LIMIT 5'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting top reviewers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { addReview, getAllReviews, getReviewsByRating, getReviewsByMovieId, getReviewsByUsername, getTopReviewers };