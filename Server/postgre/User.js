const pgPool = require('./connection');
const bcrypt = require('bcrypt');
const axios = require('axios');

const sql = {
  INSERT_USER: 'INSERT INTO customer VALUES ($1, $2, $3, $4)',
  GET_USERS: 'SELECT fname, lname, username, creation_time FROM customer',
  GET_PW: 'SELECT pw FROM customer WHERE username = $1'
  
};

async function addUser(fname, lname, uname, pw, bio, avatar) {
  // Update the SQL query to include the correct number of placeholders
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
// Modify getUserDetails to include necessary public data
async function getUserDetails(username) {
  try {
    // Fetch basic user details
    const userDetailsQuery = 'SELECT fname, lname, username, creation_time, avatar, bio FROM customer WHERE username = $1';
    const userDetailsResult = await pgPool.query(userDetailsQuery, [username]);
    let userDetails = userDetailsResult.rows.length > 0 ? userDetailsResult.rows[0] : null;

    if (!userDetails) {
      return null; // User not found
    }

    // Fetch favorite movies
    // This assumes the structure of the favorites table and the existence of a function to get movie details
    const favoritesResult = await pgPool.query('SELECT movie_id FROM favorites WHERE username = $1', [username]);
    const movieDetailsPromises = favoritesResult.rows.map(row =>
      axios.get(`http://localhost:3001/movies/${row.movie_id}`) // Or use your existing function to get movie details
    );
    const moviesDetails = await Promise.all(movieDetailsPromises);
    userDetails.favorites = moviesDetails.map(response => response.data); // Add favorites to user details

    // Fetch reviews
    // Adjust the query according to your reviews table structure
    const reviewsResult = await pgPool.query(
      'SELECT review_id, movie_id, rating, review_text, review_date FROM reviews WHERE username = $1', [username]
    );
    userDetails.reviews = reviewsResult.rows; // Add reviews to user details

    return userDetails;
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    throw error; // Rethrow the error for the caller to handle
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
          await pgPool.query('DELETE FROM group_chat WHERE username = $1', [username]);
          await pgPool.query('DELETE FROM customer WHERE username = $1', [username]);
          console.log('Deleted user');
          return { success: true };
      } else {
          return { success: false, error: 'Incorrect password' };
      }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
}

async function getOldestMembers() {
  try {
    const result = await pgPool.query(
      'SELECT username, avatar, creation_time FROM customer ORDER BY creation_time ASC LIMIT 5'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching oldest members:', error);
    throw error;
  }
}

async function getNewestMembers() {
  try {
    const result = await pgPool.query(
      'SELECT username, avatar, creation_time FROM customer ORDER BY creation_time DESC LIMIT 5'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching newest members:', error);
    throw error;
  }
}


module.exports = { addUser, getUsers, checkUser, getUserDetails, setUserAvatar, getUserGroups, deleteUser, getPasswordFromDatabase, getOldestMembers, getNewestMembers };
