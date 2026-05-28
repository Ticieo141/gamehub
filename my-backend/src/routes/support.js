import express from 'express';
import { createTicket, getUserTickets } from '../controllers/supportController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createTicket);
router.get('/', auth, getUserTickets);

export default router;
