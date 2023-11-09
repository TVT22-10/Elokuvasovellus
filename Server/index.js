require('dotenv').config();
const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/user', userRoutes);
app.use(cors());
app.use(express.static('public'));

const port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log('Server is running on port:' + port);
} );

app.get('/', (req, res) => {

    const person = [
        { fname: 'John',lname: 'lol', age: 23}

    ];

    res.json(person);

});