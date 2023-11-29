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


async function deleteUser(username) {
  try {
  // Delete associated data first
  await pgPool.query('DELETE FROM reviews WHERE username = $1', [username]);
  await pgPool.query('DELETE FROM favorites WHERE username = $1', [username]);
  await pgPool.query('DELETE FROM group_members WHERE username = $1', [username]);
  await pgPool.query('DELETE FROM group_join_requests WHERE username = $1', [username]);
  console.log('Deleted associated data');
  // Then delete the user
  const deleteU = 'DELETE FROM customer WHERE username = $1';
  await pgPool.query(deleteU, [username]);
  console.log('Deleted user');
  return { success: true }; // Return a success message or status
} catch (error) {
  console.error('Error deleting user:', error);
  throw new Error('Error deleting user'); // Throw an error if deletion fails
}
}


module.exports = {
  addUser,
  getUsers,
  checkUser,
  getUserDetails,
  setUserAvatar,
  deleteUser
};