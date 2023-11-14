const pgp = require('pg-promise')();
const config = require('../config');
const db = pgp(config.databaseURL);

const User = {
  findAll: async () => {
    return await db.any('SELECT username, fname, lname, creation_time FROM customer');
  },
  
  findById: async (id) => {
    // Update this if 'user_id' is not the correct column name
    return await db.oneOrNone('SELECT username, fname, lname, creation_time FROM customer WHERE user_id = $1', id);
  },
  create: async (username, password) => {
    // Assuming 'pw' is the column for password
    return await db.one('INSERT INTO customer (username, pw) VALUES ($1, $2) RETURNING username, fname, lname, creation_time', [username, password]);
  },
  findByUsername: async (username) => {
    return await db.oneOrNone('SELECT username, fname, lname, creation_time FROM customer WHERE username = $1', username);
  },
  update: async (id, user) => {
    // Adjust this query based on your table structure and requirements
    return await db.oneOrNone('UPDATE customer SET username = $1, pw = $2 WHERE user_id = $3 RETURNING username, fname, lname, creation_time', [user.username, user.password, id]);
  },
  delete: async (id) => {
    // Update this if 'user_id' is not the correct column name
    return await db.oneOrNone('DELETE FROM customer WHERE user_id = $1 RETURNING username, fname, lname, creation_time', id);
  },
  getUserDetails: async (username) => {
    return await db.oneOrNone('SELECT fname, lname, username, creation_time FROM customer WHERE username = $1', username);
  },
};

module.exports = User;
