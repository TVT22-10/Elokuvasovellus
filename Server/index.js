require('dotenv').config();
const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const app = express();
const axios = require('axios');
const tmdbApi = require('./tmdb/tmdb.api'); // Adjust the path as needed

const fs = require('fs');
const path = require('path');

const reviewRoutes = require('./routes/reviewRoutes');
const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes'); // Adjust the path as needed



const corsOptions = {
    origin: 'http://localhost:3000', // Or whichever origin your client is served from
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Enable CORS using the options defined above
app.use(cors(corsOptions));


// Serve static files from the 'public' directory
app.use(express.static('public'));


// Parse request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files
app.use(express.static('public'));
// User routes
app.use('/user', userRoutes);
// Favourite routes
app.use('/favorites', favoriteRoutes);
// Use the routes
app.use('/review', reviewRoutes);
// Root route
app.use('/groups', groupRoutes);
//mo
app.use('/posts', postRoutes);


app.get('/', (req, res) => {
    const person = [
        { fname: 'John', lname: 'Doe', age: 23 }
    ];
    res.json(person);
});

app.get('/popular-tmdb', async (req, res) => {
    try {
      const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/popular`, {
        params: {
          api_key: process.env.TMDB_KEY
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data from TMDB", error: error.message });
    }
  });

  app.get('/movies/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/${movieId}`, {
            params: {
                api_key: process.env.TMDB_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie details from TMDB", error: error.message });
    }
});

app.get('/movies/:movieId/cast', async (req, res) => {
  try {
      const { movieId } = req.params;
      const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/${movieId}/credits`, {
          params: {
              api_key: process.env.TMDB_KEY
          }
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching cast information from TMDB", error: error.message });
  }
});

app.get('/top-rated-tmdb', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/top_rated`, {
      params: {
        api_key: process.env.TMDB_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from TMDB", error: error.message });
  }
});

app.get('/now-playing', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/now_playing`, {
      params: {
        api_key: process.env.TMDB_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from TMDB", error: error.message });
  }
});

app.get('/upcoming', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/upcoming`, {
      params: {
        api_key: process.env.TMDB_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from TMDB", error: error.message });
  }
});

app.get('/search', async (req, res) => {
  try {
      const query = req.query.query; // Get the search query from URL parameters
      const page = req.query.page || 1; // Get the page number, default to 1 if not provided

      const response = await axios.get(`${process.env.TMDB_BASE_URL}search/movie`, {
          params: {
              api_key: process.env.TMDB_KEY,
              query: query,
              page: page // Pass the page parameter to the TMDB API
          }
      });

      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error searching TMDB", error: error.message });
  }
});

app.get('/avatars', (req, res) => {
  const avatarDir = path.join(__dirname, 'public/avatars'); // Adjust the path as necessary

  fs.readdir(avatarDir, (err, files) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error fetching avatars');
      } else {
          res.json(files);
      }
  });
});


app.get('/discover-movies', async (req, res) => {
  try {
      let params = { ...req.query, api_key: process.env.TMDB_KEY };

      if (params.genre) {
          params.with_genres = params.genre;
          delete params.genre;
      }
      if (params.startYear) {
        params['primary_release_date.gte'] = `${params.startYear}-01-01`; // Assuming Jan 1 as the start date
        delete params.startYear;
    }

    // Handle end year
    if (params.endYear) {
        params['primary_release_date.lte'] = `${params.endYear}-12-31`; // Assuming Dec 31 as the end date
        delete params.endYear;
    }

    if (params.originalLanguage) {
      params.with_original_language = params.originalLanguage;
      delete params.originalLanguage;
  }

  if (params.sortBy) {
    params.sort_by = params.sortBy;
    delete params.sortBy;
}


      const response = await axios.get(`${process.env.TMDB_BASE_URL}discover/movie`, { params });
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching data from TMDB', error);
      res.status(500).json({ message: "Error fetching data from TMDB", error: error.message });
  }
});

app.get('/movies/:movieId/videos', async (req, res) => {
  try {
      const { movieId } = req.params;
      const response = await axios.get(`${process.env.TMDB_BASE_URL}movie/${movieId}/videos`, {
          params: {
              api_key: process.env.TMDB_KEY
          }
      });
      // Optionally filter for trailers here if needed
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching video data from TMDB", error: error.message });
  }
});

// In your Express server file
app.get('/actors/:actorId', async (req, res) => {
  try {
      const { actorId } = req.params;
      const response = await axios.get(`${process.env.TMDB_BASE_URL}person/${actorId}`, {
          params: {
              api_key: process.env.TMDB_KEY
          }
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching actor details from TMDB", error: error.message });
  }
});

app.get('/actors/:actorId/movies', async (req, res) => {
  try {
    const { actorId } = req.params;
    const response = await axios.get(`${process.env.TMDB_BASE_URL}person/${actorId}/movie_credits`, {
      params: {
        api_key: process.env.TMDB_KEY
      }
    });
    res.json(response.data.cast); // Send back only the 'cast' array which contains the movies
  } catch (error) {
    res.status(500).json({ message: "Error fetching actor's movie credits from TMDB", error: error.message });
  }
});



app.get('/discover-tv', async (req, res) => {
  try {
      let params = { ...req.query, api_key: process.env.TMDB_KEY };

      // Handle genre
      if (params.genre) {
          params.with_genres = params.genre;
          delete params.genre;
      }

      // Handle start year (first air date for TV series)
      if (params.startYear) {
        params['first_air_date.gte'] = `${params.startYear}-01-01`; // Assuming Jan 1 as the start date
        delete params.startYear;
      }

      // Handle end year (first air date for TV series)
      if (params.endYear) {
        params['first_air_date.lte'] = `${params.endYear}-12-31`; // Assuming Dec 31 as the end date
        delete params.endYear;
      }

      // Handle original language
      if (params.originalLanguage) {
        params.with_original_language = params.originalLanguage;
        delete params.originalLanguage;
      }

      // Handle sorting
      if (params.sortBy) {
        params.sort_by = params.sortBy;
        delete params.sortBy;
      }

      // Make the request to TMDB API for TV series
      const response = await axios.get(`${process.env.TMDB_BASE_URL}discover/tv`, { params });
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching TV series data from TMDB', error);
      res.status(500).json({ message: "Error fetching TV series data from TMDB", error: error.message });
  }
});

app.get('/series/:seriesId', async (req, res) => {
  try {
      const { seriesId } = req.params;
      const response = await axios.get(`${process.env.TMDB_BASE_URL}tv/${seriesId}`, {
          params: {
              api_key: process.env.TMDB_KEY
          }
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching series details from TMDB", error: error.message });
  }
});


app.get('/series/:seriesId/cast', async (req, res) => {
  try {
      const { seriesId } = req.params;
      const response = await axios.get(`${process.env.TMDB_BASE_URL}tv/${seriesId}/credits`, {
          params: {
              api_key: process.env.TMDB_KEY
          }
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching series cast information from TMDB", error: error.message });
  }
});

app.get('/series/:seriesId/videos', async (req, res) => {
  try {
      const { seriesId } = req.params;
      const response = await axios.get(`${process.env.TMDB_BASE_URL}tv/${seriesId}/videos`, {
          params: {
              api_key: process.env.TMDB_KEY
          }
      });
      // Optionally filter for trailers here if needed
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching video data from TMDB", error: error.message });
  }
});

app.get('/actors/:actorId/series', async (req, res) => {
    try {
        const { actorId } = req.params;
        const response = await axios.get(`${process.env.TMDB_BASE_URL}person/${actorId}/tv_credits`, {
            params: {
                api_key: process.env.TMDB_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching TV series credits from TMDB", error: error.message });
    }
});

app.get('/searchTV', async (req, res) => {
  try {
      const query = req.query.query; // Get the search query from URL parameters
      const page = req.query.page || 1; // Get the page number, default to 1 if not provided

      const response = await axios.get(`${process.env.TMDB_BASE_URL}search/tv`, { // Change to the TV search endpoint
          params: {
              api_key: process.env.TMDB_KEY,
              query: query,
              page: page // Pass the page parameter to the TMDB API
          }
      });

      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error searching TMDB for TV series", error: error.message });
  }
});



  
// Start the server
const port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log('Server is running on port:' + port);
});
