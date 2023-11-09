const router = require('express').Router();
const multer = require('multer'); // Import multer for handling file uploads
const upload = multer({dest: 'upload/'}); // Initialize the multer middleware
const bcrypt = require('bcrypt');

const { addUser, getUsers } = require('../postgre/User');

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
        res.json({ error: error.message }).status(500);
    }
});

module.exports = router;