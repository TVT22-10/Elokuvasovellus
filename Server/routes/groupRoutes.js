const express = require('express');
const router = express.Router();
const { addGroup } = require('../postgre/group');

// POST request to add a new group
router.post('/add', async (req, res) => {
  try {
    const { username, group_id, groupName, groupDescription } = req.body;

    // Call the addGroup function from your pg file
    const newGroup = await addGroup(username, group_id, groupName, groupDescription);

    res.status(201).json({ message: 'Group added successfully', newGroup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
