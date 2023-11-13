const router = require('express').Router();
const multer = require('multer'); // Import multer for handling file uploads
const upload = multer({dest: 'upload/'}); // Initialize the multer middleware
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { addUser, getUsers, checkUser, getUserDetails } = require('../postgre/User');

router.get('/', async (req, res) => {

    try {
        res.json(await getUsers());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

//user root post mapping. supports urlencoded and multer
router.post('/register', upload.none(), async (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const uname = req.body.uname;
    let pw = req.body.pw;


    pw = await bcrypt.hash(pw, 10);


    try {
        await addUser(fname, lname, uname, pw);
        res.end();
    } catch (error) {
        console.log(error);
        res.json({ error: error.message }).status(500);
    }
});

router.post('/login', upload.none(), async (req, res) => {

    const uname = req.body.uname;
    let pw = req.body.pw;

   const pwHash = await checkUser(uname);

   if(pwHash){
       const isCorrect = await bcrypt.compare(pw, pwHash);
       if(isCorrect){
        
        const userDetails = await getUserDetails(uname);
        console.log(userDetails); // Log the userDetails
        const token = jwt.sign({username: uname}, process.env.JWT_SECRET_KEY);
        res.status(200).json({ jwtToken: token, userData: userDetails }); // Include userDetails in the response
       }else{
        res.status(401).json({error: 'Incorrect password'});
       }
       }else{
           res.status(401).json({error: 'Customer not found'});
       }

});
//mappaus jolla käyttäjä voi hakea tietoa itsestään
//Authorization: Bearer token

router.get('/private', async (req, res) => {    
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userDetails = await getUserDetails(decodedToken.username);

        // Include user details directly in the response
        res.status(200).json({
            private: 'This is private data for ' + decodedToken.username + ' only',
            ...userDetails // Spread user details into the response
        });
    } catch (error) {
        res.status(403).json({error: 'Access forbidden'});
    }
});

module.exports = router;
