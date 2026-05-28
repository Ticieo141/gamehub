import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Coupon', couponSchema);
