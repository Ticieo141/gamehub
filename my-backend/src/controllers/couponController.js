import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or inactive coupon code' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        res.json({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin only: Create coupon
export const createCoupon = async (req, res) => {
    try {
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin only: Get all coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
