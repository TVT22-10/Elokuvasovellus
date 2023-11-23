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
    getGroupDetails,
} = require('../postgre/group.js');

// Route to create a new group
router.post('/create', authenticateToken, createGroup);

// Route to get all members of a group
router.get('/:groupId/members', getGroupMembers);

router.get('/:groupId/details', authenticateToken, async (req, res) => {
    const { groupId } = req.params;

    try {
        const groupDetails = await getGroupDetails(groupId);
        if (!groupDetails) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(groupDetails);
    } catch (error) {
        console.error('Error fetching group details:', error);
        res.status(500).json({ message: 'Error fetching group details' });
    }
});

router.post('/:groupId/request-join', authenticateToken, sendJoinRequest);

router.get('/:groupId/requests', authenticateToken, viewJoinRequests);

router.put('/:groupId/requests/:requestId', authenticateToken, handleJoinRequest);

// Add more routes as needed...

module.exports = router;
