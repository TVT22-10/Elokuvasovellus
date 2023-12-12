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
    getAllGroups,
    removeGroupMember,
    updateGroupDescription,
    addNewsToGroup,
    getGroupNews,
    assignNewOwner,
    postGroupMessage,
    getGroupMessages,
    deleteGroupMessage,
  

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

router.get('/all', async (req, res) => {
    try {
        const groups = await getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching all groups:', error);
        res.status(500).json({ message: 'Error fetching all groups' });
    }
});

router.get('/:groupId/news', authenticateToken, getGroupNews);


router.post('/:groupId/news', authenticateToken, addNewsToGroup);

// Route to assign ownership to a new owner
router.put('/:groupId/assign-owner/:newOwnerUsername', authenticateToken, async (req, res) => {
    const { groupId, newOwnerUsername } = req.params;

    try {
        const result = await assignNewOwner(groupId, newOwnerUsername, req.user.username);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error assigning ownership:', error);
        res.status(500).json({ message: 'Error assigning ownership' });
    }
});


router.put('/:groupId/description', authenticateToken, updateGroupDescription);

router.post('/:groupId/request-join', authenticateToken, sendJoinRequest);

router.get('/:groupId/requests', authenticateToken, viewJoinRequests);

router.put('/:groupId/requests/:requestId', authenticateToken, handleJoinRequest);

router.delete('/:groupId/members/:username', authenticateToken, removeGroupMember);

router.post('/:groupId/message', authenticateToken, postGroupMessage);


router.get('/:groupId/messages', authenticateToken, getGroupMessages);

router.delete('/:groupId/messages/:messageId', authenticateToken, deleteGroupMessage);






// Add more routes as needed...

module.exports = router;
