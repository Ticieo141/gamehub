import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.post('/remove', auth, removeFromCart);

export default router;
