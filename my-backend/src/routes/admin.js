import express from 'express';
import { getStats, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { createCoupon, getAllCoupons } from '../controllers/couponController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes here are protected and admin-only
router.use(auth, admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);

export default router;
