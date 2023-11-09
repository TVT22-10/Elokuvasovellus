const pgPool = require('./connection');


const sql = {
  INSERT_USER: 'INSERT INTO customer VALUES ($1, $2, $3, $4)',
  GET_USERS: 'SELECT fname, lname, username FROM customer'
};

async function addUser(fname, lname, uname, pw){
    await pgPool.query(sql.INSERT_USER, [uname, fname, lname, pw]);
}

async function getUsers(){
    const result = await pgPool.query(sql.GET_USERS);
    const rows = result.rows;
    return rows;

}

module.exports = {addUser, getUsers};