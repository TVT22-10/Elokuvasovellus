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
  try {
    const result = await pgPool.query('SELECT * FROM reviews');
    res.json(result.rows); // Check if result.rows is not undefined before sending
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
    const result = await pgPool.query('SELECT * FROM reviews WHERE movie_id = $1', [movieId]);

    res.json(result.rows); // Check if result.rows is not undefined before sending
  } catch (error) {
    console.error('Error getting reviews by movie ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { addReview, getAllReviews, getReviewsByRating, getReviewsByMovieId };
