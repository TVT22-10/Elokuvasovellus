require('dotenv').config();
const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();

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

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log('Server is running on port:' + port);
});
