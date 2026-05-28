import express from 'express';
import { validateCoupon } from '../controllers/couponController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', auth, validateCoupon);

export default router;
