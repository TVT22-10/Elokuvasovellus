const express = require('express');
const router = express.Router();
const authenticateToken = require('./authMiddleware'); // Adjust the path as needed

// Import necessary functions from your controller
const {
    createGroup,
    getGroupMembers,
    sendJoinRequest,
    viewJoinRequests,
    handleJoinRequest,
} = require('../postgre/group.js');

// Route to create a new group
router.post('/create', authenticateToken, createGroup);

// Route to get all members of a group
router.get('/:groupId/members', getGroupMembers);

router.post('/:groupId/request-join', authenticateToken, sendJoinRequest);

router.get('/:groupId/requests', authenticateToken, viewJoinRequests);

router.put('/:groupId/requests/:requestId', authenticateToken, handleJoinRequest);

// Add more routes as needed...

module.exports = router;
