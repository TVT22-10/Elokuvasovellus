const router = require('express').Router();
const multer = require('multer'); // Import multer for handling file uploads
const upload = multer({ dest: 'upload/' }); // Initialize the multer middleware
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authMiddleware'); // Adjust the path as needed
const pgPool = require('../postgre/connection'); // Adjust the path as needed



const { addUser, getUsers, checkUser, getUserDetails, setUserAvatar, getUserGroups, deleteUser, getPasswordFromDatabase, getOldestMembers, getNewestMembers } = require('../postgre/User');
const e = require('express');

router.get('/', async (req, res) => {

    try {
        res.json(await getUsers());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

// User root post mapping. Supports urlencoded and multer
router.post('/register', upload.none(), async (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const uname = req.body.uname;
    let pw = req.body.pw;
    const bio = "No bio yet"; // Set an initial bio value
    const avatar = "avatar1.png"; // Set an initial avatar value

    // Check if uname exists in the request body
    if (!uname) {
        return res.status(400).json({ error: 'Username (uname) is required.' });
    }

    pw = await bcrypt.hash(pw, 10);

    try {
        await addUser(fname, lname, uname, pw, bio, avatar);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', upload.none(), async (req, res) => {
    const uname = req.body.uname;
    let pw = req.body.pw;

    const pwHash = await checkUser(uname);

    if (pwHash) {
        const isCorrect = await bcrypt.compare(pw, pwHash);
        if (isCorrect) {
            const userDetails = await getUserDetails(uname);

            const tokenExpirationTime = '1h';

            // Sign the token with an expiration time
            const token = jwt.sign({ username: uname }, process.env.JWT_SECRET_KEY, { expiresIn: tokenExpirationTime });

            res.status(200).json({ jwtToken: token, userData: userDetails });
        } else {
            res.status(401).json({ error: 'Incorrect password' });
        }
    } else {
        res.status(401).json({ error: 'Customer not found' });
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
        res.status(403).json({ error: 'Access forbidden' });
    }
});

// New endpoint to get public profile data
router.get('/profile/:username', async (req, res) => {
    try {
      const profileData = await getUserDetails(req.params.username);
      if (profileData) {
        res.json(profileData);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  });


// Express-reitti tiedostossa routes/userRoutes.js
router.put('/profile', authenticateToken, async (req, res) => {
    const { firstName, lastName, avatar, bio } = req.body; // Include the bio variable here

    try {
        // Update the user's first name, last name, avatar, and bio using the username from the token
        const query = 'UPDATE customer SET fname = $1, lname = $2, avatar = $3, bio = $4 WHERE username = $5';
        await pgPool.query(query, [firstName, lastName, avatar, bio, req.user.username]);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: error.message });
    }
});




// Add this to your routes file
router.get('/groups', authenticateToken, async (req, res) => {
    const username = req.user.username; // Extracting username from the token

    try {
        const userGroups = await getUserGroups(username);
        res.status(200).json(userGroups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: 'Error fetching user groups' });
    }
});



router.put('/avatar', authenticateToken, async (req, res) => {
    const username = req.user.username; // Assuming username is stored in req.user
    const avatarFilename = req.body.avatar;

    try {
        await setUserAvatar(username, avatarFilename);
        res.json({ message: 'Avatar updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:username', authenticateToken, async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;
    try {
        const pwHash = await getPasswordFromDatabase(username);
        const isPasswordCorrect = await bcrypt.compare(password, pwHash);

        if (isPasswordCorrect) {
            const deletionResult = await deleteUser(username, password); // Pass password to deleteUser

            if (deletionResult.success) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(500).json({ error: 'Error deleting user' });
            }

        } else {
            res.status(401).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

router.get('/oldest-members', async (req, res) => {
    try {
      const oldestMembers = await getOldestMembers();
      res.json(oldestMembers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/newest-members', async (req, res) => {
    try {
      const newestMembers = await getNewestMembers();
      res.json(newestMembers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
