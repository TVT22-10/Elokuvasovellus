const pgPool = require('./connection');
const bcrypt = require('bcrypt');

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

async function getUserGroups(username) {
  const query = `
    SELECT g.group_id, g.groupname, g.creator_username
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.username = $1;
  `;

  const result = await pgPool.query(query, [username]);
  return result.rows.map(group => ({
    ...group,
    is_owner: group.creator_username === username
  }));
}




async function setUserAvatar(username, avatarFilename) {
  const query = 'UPDATE customer SET avatar = $1 WHERE username = $2';
  await pgPool.query(query, [avatarFilename, username]);
}


/*async function deleteUser(username) {
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
*/


// Tämä on vain esimerkki - mukauta omaan tietokantakäsittelyysi sopivaksi

async function getPasswordFromDatabase(username) {
  try {
    const query = 'SELECT pw FROM customer WHERE username = $1';
    const result = await pgPool.query(query, [username]);

    if (result.rows.length > 0) {
      return result.rows[0].pw; // Palauta käyttäjän tiivistetty salasana (hash)
    } else {
      return null; // Palauta null, jos käyttäjää ei löydy
    }
  } catch (error) {
    console.error('Virhe salasanan hakemisessa tietokannasta:', error);
    throw new Error('Virhe salasanan hakemisessa tietokannasta');
  }
}


async function deleteUser(username, password) {
  try {
      const pwHash = await getPasswordFromDatabase(username);

      const isPasswordCorrect = await bcrypt.compare(password, pwHash);

      if (isPasswordCorrect) {
          await pgPool.query('DELETE FROM reviews WHERE username = $1', [username]);
          await pgPool.query('DELETE FROM favorites WHERE username = $1', [username]);
          await pgPool.query('DELETE FROM group_members WHERE username = $1', [username]);
          await pgPool.query('DELETE FROM group_join_requests WHERE username = $1', [username]);

          await pgPool.query('DELETE FROM customer WHERE username = $1', [username]);
          console.log('Deleted user');
          return { success: true };
      } else {
          return { success: false, error: 'Incorrect password' };
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error deleting user');
  }
}

module.exports = { addUser, getUsers, checkUser, getUserDetails, setUserAvatar, getUserGroups, deleteUser, getPasswordFromDatabase };
