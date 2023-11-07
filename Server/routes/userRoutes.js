const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/users', userController.getUsers);

router.get('/users/:id', userController.getUser);

router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);

router.post('/register', userController.register);

router.post('/login', userController.login);


module.exports = router;