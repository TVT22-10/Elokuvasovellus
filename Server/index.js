require('dotenv').config();
const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();
const axios = require('axios');
const tmdbApi = require('./tmdb/tmdb.api'); // Adjust the path as needed


const corsOptions = {
    origin: 'http://localhost:3000', // Or whichever origin your client is served from
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Enable CORS using the options defined above
app.use(cors(corsOptions));

// Parse request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// User routes
app.use('/user', userRoutes);

// Root route
app.get('/', (req, res) => {
    const person = [
        { fname: 'John', lname: 'Doe', age: 23 }
    ];
    res.json(person);
});

app.get('/test-tmdb', async (req, res) => {
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


  
// Start the server
const port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log('Server is running on port:' + port);
});
