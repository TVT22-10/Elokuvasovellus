require('dotenv').config();

const config = {
  databaseURL: process.env.DATABASE_URL
};

module.exports = config;