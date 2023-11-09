const pgPool = require('./connection');


const sql = {
  INSERT_USER: 'INSERT INTO customer VALUES ($1, $2, $3, $4)',
  GET_USERS: 'SELECT fname, lname, username FROM customer',
  GET_PW: 'SELECT pw FROM customer WHERE username = $1'
};

async function addUser(fname, lname, uname, pw){
    await pgPool.query(sql.INSERT_USER, [uname, fname, lname, pw]);
}

async function getUsers(){
    const result = await pgPool.query(sql.GET_USERS);
    const rows = result.rows;
    return rows;

}

async function checkUser(username){
  const result = await pgPool.query(sql.GET_PW, [username]);

  if(result.rows.length > 0){
    return result.rows[0].pw;
  }else{
    return null;
  }

}
module.exports = {addUser, getUsers, checkUser};