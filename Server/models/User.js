const pgp = require('pg-promise')();
const config = require('../config');
const db = pgp(config.databaseURL);

const User = {
  findAll: async () => {
    return await db.any('SELECT * FROM users');
  },
  
  findById: async (id) => {
    return await db.oneOrNone('SELECT * FROM users WHERE user_id = $1', id);
  },
  create: async (username, password) => {
    return await db.one('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
  },
  findByUsername: async (username) => {
    return await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
  },
  update: async (id, user) => {
    return await db.oneOrNone('UPDATE users SET username = $1, password = $2 WHERE user_id = $3 RETURNING *', [user.username, user.password, id]);
  },
  delete: async (id) => {
    return await db.oneOrNone('DELETE FROM users WHERE user_id = $1 RETURNING *', id);
  }
};

module.exports = User;