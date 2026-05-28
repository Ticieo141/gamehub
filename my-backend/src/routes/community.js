import express from 'express';
import { getAllPosts, createPost, addReply, toggleLike, deletePost, getAdminPosts, updatePostStatus } from '../controllers/communityController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/admin', auth, admin, getAdminPosts);
router.post('/', auth, createPost);
router.post('/:id/reply', auth, addReply);
router.put('/:id/like', auth, toggleLike);
router.patch('/:id/status', auth, admin, updatePostStatus);
router.delete('/:id', auth, admin, deletePost);

export default router;
