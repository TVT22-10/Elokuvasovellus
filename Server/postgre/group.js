const pgPool = require('./connection');
// Adjust the path based on your actual file structure
const axios = require('axios');

async function addGroup(group_id, username, groupName, groupDescription) {
    try {
      const query = {
        text: 'INSERT INTO groups (username, group_id, groupname, groupdescription) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [username, group_id , groupName, groupDescription],
      };
  
      const result = await pgPool.query(query);
      return result.rows[0]; // Return the inserted row if needed
    } catch (error) {
      throw new Error(`Error adding group: ${error.message}`);
    }
  }
  
  module.exports = { addGroup };
  