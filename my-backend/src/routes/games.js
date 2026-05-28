import express from 'express';
import { getAllGames, getGameById, createGame, updateGame, deleteGame } from '../controllers/gameController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);

// Admin only routes
router.post('/', auth, admin, createGame);
router.put('/:id', auth, admin, updateGame);
router.delete('/:id', auth, admin, deleteGame);

export default router;
