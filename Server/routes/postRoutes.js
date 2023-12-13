const express = require('express');
const router = express.Router();
const { createPost, getPosts, deletePost } = require('../postgre/posts'); // Adjust the path as needed
const authenticateToken = require('./authMiddleware'); // Include the path to your authentication middleware

// Endpoint to create a new post
router.post('/', authenticateToken, async (req, res) => {
    const username = req.user.username; // Extract username from the authenticated user
    const { content } = req.body;

    try {
        const post = await createPost(username, content);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const posts = await getPosts(username);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

// Endpoint to delete a post
router.delete('/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const username = req.user.username; // Extract username from the authenticated user

    try {
        await deletePost(postId, username);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});

module.exports = router;
