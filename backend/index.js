require('dotenv').config();
const cors = require('cors');
const multer = require('multer');
const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3001;


//Routes

app.listen(port, function() {
    console.log('Server is running on port:' + port);
} );

app.get('/', function(req, res) {
    res.send('<h1>hello</h1>');
});