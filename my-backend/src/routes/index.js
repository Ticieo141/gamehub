import express from 'express';
import authRoutes from './auth.js';
import gameRoutes from './games.js';
import cartRoutes from './cart.js';
import orderRoutes from './orders.js';
import communityRoutes from './community.js';
import supportRoutes from './support.js';
import adminRoutes from './admin.js';
import couponRoutes from './coupons.js';
import userRoutes from './users.js';
import uploadRoutes from './upload.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/community', communityRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);
router.use('/coupons', couponRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);

export default router;
