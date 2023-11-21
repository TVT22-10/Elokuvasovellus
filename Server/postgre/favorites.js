const pgPool = require('./connection'); // Adjust the path based on your actual file structure


const getFavorites = async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pgPool.query('SELECT * FROM favorites WHERE username = $1', [username]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addToFavorites = async (req, res) => {
  const { username } = req.params;
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

module.exports = { getFavorites, addToFavorites, removeFromFavorites, };
