const pgPool = require('./connection'); // Adjust the path as needed

async function createPost(username, content) {
    const query = 'INSERT INTO posts (username, content) VALUES ($1, $2) RETURNING *;';
    const values = [username, content];

    try {
        const result = await pgPool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


async function getPosts(username) {
    const query = 'SELECT * FROM posts WHERE username = $1 ORDER BY creation_time DESC;';
    const values = [username];

    try {
        const result = await pgPool.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}


async function deletePost(postId, username) {
    const query = 'DELETE FROM posts WHERE post_id = $1 AND username = $2;';
    const values = [postId, username];

    try {
        await pgPool.query(query, values);
    } catch (error) {
        throw error;
    }
}


module.exports = { createPost, getPosts, deletePost };
