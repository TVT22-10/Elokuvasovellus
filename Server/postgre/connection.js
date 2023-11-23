require('dotenv').config();
const {Pool} = require('pg');

const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    ssl: true
});

pgPool.connect((err) => {
    if(err) {
        console.log(err.message);
    }
})  

module.exports = pgPool;
