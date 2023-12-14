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
        const checkGroupQuery = `
            SELECT EXISTS (SELECT 1 FROM groups WHERE group_id = $1) AS "groupExists";
        `;

        const checkGroupResult = await pgPool.query(checkGroupQuery, [groupId]);

        const groupExists = checkGroupResult.rows[0].groupExists;

        if (!groupExists) {
            return res.status(404).json({ message: 'Group not found' });
        }

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

        const requestExistenceQuery = 'SELECT * FROM group_join_requests WHERE request_id = $1 AND group_id = $2;';
        const requestExistenceResult = await pgPool.query(requestExistenceQuery, [requestId, groupId]);
        if (requestExistenceResult.rows.length === 0) {
            return res.status(404).json({ message: 'Request does not exist for the specified group' });
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

        res.status(200).json({ message: `Request ${requestStatus}` });
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
    const { newOwnerUsername } = req.body;

    try {
        const groupQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const groupResult = await pgPool.query(groupQuery, [groupId]);

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const isOwner = groupResult.rows[0].creator_username === currentUser;
       
        if (!isOwner) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }
        // Check if the user is the owner or the member trying to leave
        if (!isOwner && currentUser !== username) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        if (isOwner && currentUser === username) {
            // If the new owner's username is provided, assign the new owner
            if (newOwnerUsername) {
                await assignNewOwner(req, res);
            } else {
                return res.status(403).json({ message: 'Owner cannot leave without assigning a new owner' });
            }
        }

        // Check if the member exists in the group before removing
        const memberExistsQuery = 'SELECT 1 FROM group_members WHERE group_id = $1 AND username = $2;';
        const memberExistsResult = await pgPool.query(memberExistsQuery, [groupId, username]);

        if (memberExistsResult.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found in the group' });
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


async function updateGroupDescription(req, res) {
    const { groupId } = req.params;
    const { groupDescription } = req.body;
    const ownerUsername = req.user.username; // Assuming username is stored in req.user

    console.log('Received group description:', groupDescription);

    try {
        // Check if the user is the owner of the group
        const ownerCheckQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const ownerCheckResult = await pgPool.query(ownerCheckQuery, [groupId]);

        if (ownerCheckResult.rows.length === 0 || ownerCheckResult.rows[0].creator_username !== ownerUsername) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Update the group description
        const updateDescriptionQuery = 'UPDATE groups SET groupdescription = $1 WHERE group_id = $2;';
        await pgPool.query(updateDescriptionQuery, [groupDescription, groupId]);

        res.status(200).json({ message: 'Group description updated successfully' });
    } catch (error) {
        console.error('Error updating group description:', error);
        res.status(500).json({ message: 'Error updating group description' });
    }
}

// New function to add news to a group
async function addNewsToGroup(req, res) {
    const { groupId } = req.params;
    const { title, description, articleUrl, imageUrl } = req.body;

    try {
        const query = `
            INSERT INTO groupnews (group_id, title, description, article_url, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pgPool.query(query, [groupId, title, description, articleUrl, imageUrl]);

        const addedNewsItem = result.rows[0];
        res.status(201).json({ message: 'News added to the group', newsItem: addedNewsItem });
    } catch (error) {
        console.error('Error adding news to group:', error);
        res.status(500).json({ message: 'Error adding news to group', error: error.message }); // Include error details in the response
    }
}

// In group.js
async function getGroupNews(req, res) {
    const { groupId } = req.params;

    try {
        // Query the database to get news for the specified group
        const query = 'SELECT * FROM groupnews WHERE group_id = $1;';
        const result = await pgPool.query(query, [groupId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching group news:', error);
        res.status(500).json({ message: 'Error fetching group news', error: error.message });
    }
}

async function assignNewOwner(groupId, newOwnerUsername, currentUser) {
    try {
        const groupQuery = 'SELECT creator_username FROM groups WHERE group_id = $1;';
        const groupResult = await pgPool.query(groupQuery, [groupId]);

        if (groupResult.rows.length === 0) {
            return { success: false, message: 'Group not found' };
        }

        const currentOwner = groupResult.rows[0].creator_username;

        if (currentOwner !== currentUser) {
            return { success: false, message: 'Only the current owner can assign a new owner' };
        }

        const updateOwnerQuery = 'UPDATE groups SET creator_username = $1 WHERE group_id = $2;';
        await pgPool.query(updateOwnerQuery, [newOwnerUsername, groupId]);

        return { success: true, message: 'New owner assigned successfully' };
    } catch (error) {
        console.error('Error assigning new owner:', error);
        return { success: false, message: 'Error assigning new owner' };
    }
}

async function postGroupMessage(req, res) {
    const { groupId } = req.params;
    const { message } = req.body;
    const username = req.user.username; // Extracted from the token by authenticateToken middleware

    // Check if the user is a member of the group
    const checkMembershipQuery = 'SELECT * FROM group_members WHERE group_id = $1 AND username = $2';
    try {
        const membershipResult = await pgPool.query(checkMembershipQuery, [groupId, username]);

        if (membershipResult.rows.length === 0) {
            return res.status(403).json({ message: 'User is not a member of the group' });
        }

        // Insert the message into the group_chat table
        const insertMessageQuery = 'INSERT INTO group_chat (group_id, username, message, sent_time) VALUES ($1, $2, $3, $4)';
        const utcTime = new Date().toISOString();
        await pgPool.query(insertMessageQuery, [groupId, username, message, utcTime]);


        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error in postGroupMessage:', error);
        res.status(500).json({ message: 'Error posting message' });
    }
}

async function getGroupMessages(req, res) {
    const { groupId } = req.params;
    const username = req.user.username; // Extracted from the token by authenticateToken middleware

    // Check if the user is a member of the group
    const checkMembershipQuery = 'SELECT * FROM group_members WHERE group_id = $1 AND username = $2';
    try {
        const membershipResult = await pgPool.query(checkMembershipQuery, [groupId, username]);

        if (membershipResult.rows.length === 0) {
            return res.status(403).json({ message: 'User is not a member of the group' });
        }

        // Retrieve the messages along with user avatars
        const getMessagesQuery = `
            SELECT gc.message_id, gc.group_id, gc.username, gc.message, gc.sent_time, c.avatar
            FROM group_chat gc
            JOIN customer c ON gc.username = c.username
            WHERE gc.group_id = $1
            ORDER BY gc.sent_time DESC;
        `;
        const messages = await pgPool.query(getMessagesQuery, [groupId]);

        res.json(messages.rows);
    } catch (error) {
        console.error('Error in getGroupMessages:', error);
        res.status(500).json({ message: 'Error retrieving messages' });
    }
}

async function deleteGroupMessage(req, res) {
    const { groupId, messageId } = req.params;
    const username = req.user.username;

    try {
        // Check if the user is the sender of the message or the group owner
        const checkUserQuery = `
            SELECT gc.username, g.creator_username
            FROM group_chat gc
            JOIN groups g ON gc.group_id = g.group_id
            WHERE gc.message_id = $1 AND gc.group_id = $2;
        `;
        const userResult = await pgPool.query(checkUserQuery, [messageId, groupId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }

        const isSender = userResult.rows[0].username === username;
        const isOwner = userResult.rows[0].creator_username === username;

        if (!isSender && !isOwner) {
            return res.status(403).json({ message: 'Unauthorized to delete this message' });
        }

        // Delete the message
        const deleteQuery = 'DELETE FROM group_chat WHERE message_id = $1;';
        await pgPool.query(deleteQuery, [messageId]);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message' });
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
    updateGroupDescription,
    addNewsToGroup,
    getGroupNews,
    assignNewOwner,
    postGroupMessage,
    getGroupMessages,
    deleteGroupMessage,
};