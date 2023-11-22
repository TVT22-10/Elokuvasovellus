const pgPool = require('./connection');

const sql = {
  INSERT_USER: 'INSERT INTO customer VALUES ($1, $2, $3, $4)',
  GET_USERS: 'SELECT fname, lname, username, creation_time FROM customer',
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
// In User.js or wherever getUserDetails is defined
async function getUserDetails(username) {
  const result = await pgPool.query('SELECT fname, lname, username, creation_time, avatar FROM customer WHERE username = $1', [username]);
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
}



async function setUserAvatar(username, avatarFilename) {
  const query = 'UPDATE customer SET avatar = $1 WHERE username = $2';
  await pgPool.query(query, [avatarFilename, username]);
}

module.exports = { addUser, getUsers, checkUser, getUserDetails, setUserAvatar };


