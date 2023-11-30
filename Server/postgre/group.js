const pgPool = require('./connection');
// Adjust the path based on your actual file structure
const axios = require('axios');

// Function to create a new group
async function createGroup(req, res) {
    const { groupname, groupdescription } = req.body;
    const creatorUsername = req.user.username;

    try {
        const insertGroupQuery = 'INSERT INTO groups (groupname, groupdescription, creator_username) VALUES ($1, $2, $3) RETURNING group_id;';
        const groupResult = await pgPool.query(insertGroupQuery, [groupname, groupdescription, creatorUsername]);
        const newGroupId = groupResult.rows[0].group_id;

        const insertMemberQuery = 'INSERT INTO group_members (group_id, username) VALUES ($1, $2);';
        await pgPool.query(insertMemberQuery, [newGroupId, creatorUsername]);

        res.status(201).json({ message: 'Group created and creator added as member', group: groupResult.rows[0] });
    } catch (error) {
        console.error('Error creating group or adding member:', error);
        res.status(500).json({ message: 'Error creating group' });
    }
}


// Function to get all members of a group
async function getGroupMembers(req, res) {
    const { groupId } = req.params;

    try {
        const query = `
            SELECT gm.username, c.avatar, gm.joined_date,
            CASE WHEN gm.username = (SELECT creator_username FROM groups WHERE group_id = gm.group_id) THEN 0 ELSE 1 END as is_owner
            FROM group_members gm
            JOIN customer c ON gm.username = c.username
            WHERE gm.group_id = $1
            ORDER BY is_owner, gm.joined_date;

        `;
        const result = await pgPool.query(query, [groupId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting group members:', error);
        res.status(500).json({ message: 'Error getting group members' });
    }
}

// In your groupController.js or a similar file
async function sendJoinRequest(req, res) {
    const { groupId } = req.params;
    const username = req.user.username; // Assuming username is stored in req.user

    try {
        const query = 'INSERT INTO group_join_requests (group_id, username, request_status) VALUES ($1, $2, $3) RETURNING *;';
        const result = await pgPool.query(query, [groupId, username, 'pending']);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error sending join request:', error);
        res.status(500).json({ message: 'Error sending join request' });
    }
}

async function viewJoinRequests(req, res) {
    const { groupId } = req.params;
    // Assuming group owner's username is stored in req.user
    const ownerUsername = req.user.username;

    try {
        // First, verify if the user is the owner of the group
        const groupQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const groupResult = await pgPool.query(groupQuery, [groupId]);

        if (groupResult.rows.length === 0 || groupResult.rows[0].creator_username !== ownerUsername) {
            return res.status(403).json({ message: 'Unauthorized to view these join requests' });
        }

        const query = 'SELECT * FROM group_join_requests WHERE group_id = $1 AND request_status = $2;';
        const result = await pgPool.query(query, [groupId, 'pending']);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error viewing join requests:', error);
        res.status(500).json({ message: 'Error viewing join requests' });
    }
}

async function handleJoinRequest(req, res) {
    const { groupId, requestId } = req.params;
    const { accept } = req.body; // 'accept' should be a boolean
    const ownerUsername = req.user.username; // Assuming username is stored in req.user

    try {
        // Verify if the user is the owner of the group
        const ownerCheckQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const ownerCheckResult = await pgPool.query(ownerCheckQuery, [groupId]);
        if (ownerCheckResult.rows.length === 0 || ownerCheckResult.rows[0].creator_username !== ownerUsername) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Update the request status
        const updateRequestStatusQuery = 'UPDATE group_join_requests SET request_status = $1 WHERE request_id = $2 AND group_id = $3 RETURNING username;';
        const requestStatus = accept ? 'accepted' : 'rejected';
        const updateResult = await pgPool.query(updateRequestStatusQuery, [requestStatus, requestId, groupId]);

        // If the request is accepted, add the user to the group_members table
        if (accept && updateResult.rows.length > 0) {
            const memberUsername = updateResult.rows[0].username;
            const addMemberQuery = 'INSERT INTO group_members (group_id, username) VALUES ($1, $2);';
            await pgPool.query(addMemberQuery, [groupId, memberUsername]);
        }
        
        res.status(200).json({ message: `Request ${requestStatus}`});
    } catch (error) {
        console.error('Error handling join request:', error);
        res.status(500).json({ message: 'Error handling join request' });
    }

    
}

async function getGroupDetails(groupId) {
    try {
        const query = 'SELECT * FROM groups WHERE group_id = $1;';
        const result = await pgPool.query(query, [groupId]);

        if (result.rows.length === 0) {
            return null; // Return null if the group ID doesn't exist
        }

        return result.rows[0]; // Return the group details
    } catch (error) {
        console.error('Error fetching group details:', error);
        throw error; // Handle the error or rethrow it
    }
}

async function getAllGroups() {
    try {
        const query = 'SELECT * FROM groups;';
        const result = await pgPool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching all groups:', error);
        throw error; // You can also handle the error here as per your error handling strategy
    }
}

// ... (existing imports and code)

/*async function removeGroupMember(req, res) {
    const { groupId, username } = req.params; // memberId is the ID of the member to be removed
    const ownerUsername = req.user.username; // Assuming username is stored in req.user

    try {
        // Verify if the user is the owner of the group
        const ownerCheckQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const ownerCheckResult = await pgPool.query(ownerCheckQuery, [groupId]);

        if (ownerCheckResult.rows.length === 0 || ownerCheckResult.rows[0].creator_username !== ownerUsername) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Remove the member from the group_members table
        const removeMemberQuery = 'DELETE FROM group_members WHERE group_id = $1 AND username = $2;';
        await pgPool.query(removeMemberQuery, [groupId, username]);

        const removeRequestQuery = 'DELETE FROM group_join_requests WHERE group_id = $1 AND username = $2;';
        await pgPool.query(removeRequestQuery, [groupId, username]);

        res.status(200).json({ message: 'Member removed from the group' });
    } catch (error) {
        console.error('Error removing group member:', error);
        res.status(500).json({ message: 'Error removing group member' });
    }
}
*/

async function removeGroupMember(req, res) {
    const { groupId, username } = req.params;
    const currentUser = req.user.username;

    try {
        const groupQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const groupResult = await pgPool.query(groupQuery, [groupId]);

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const isOwner = groupResult.rows[0].creator_username === currentUser;

        // Check if the user is the owner or the member trying to leave
        if (!isOwner && currentUser !== username) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Remove the member from the group_members table
        const removeMemberQuery = 'DELETE FROM group_members WHERE group_id = $1 AND username = $2;';
        await pgPool.query(removeMemberQuery, [groupId, username]);

        const removeRequestQuery = 'DELETE FROM group_join_requests WHERE group_id = $1 AND username = $2;';
        await pgPool.query(removeRequestQuery, [groupId, username]);

        res.status(200).json({ message: 'Member removed from the group' });
    } catch (error) {
        console.error('Error removing group member:', error);
        res.status(500).json({ message: 'Error removing group member' });
    }
}





// Export your functions to use them in your routes
module.exports = {
    createGroup,
    getGroupMembers,
    sendJoinRequest,
    viewJoinRequests,
    handleJoinRequest,
    getGroupDetails,
    getAllGroups,
    removeGroupMember,
};