import Order from '../models/Order.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Game from '../models/Game.js';

export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, billingInfo, paymentMethod, couponCode } = req.body;

        let discountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
            if (coupon && new Date() <= coupon.expiryDate && coupon.usageCount < coupon.usageLimit) {
                if (coupon.discountType === 'percentage') {
                    discountAmount = (totalAmount * coupon.discountValue) / 100;
                } else {
                    discountAmount = coupon.discountValue;
                }
                // Increment usage
                coupon.usageCount += 1;
                await coupon.save();
            }
        }

        // Check availability and mark as sold
        const deliveredAccounts = [];
        for (const item of items) {
            const game = await Game.findById(item._id);
            if (!game || game.status !== 'available') {
                return res.status(400).json({ message: `Account for ${item.title} is no longer available` });
            }

            deliveredAccounts.push({
                gameId: game._id,
                title: game.title,
                username: game.accountDetails.username,
                password: game.accountDetails.password
            });

            game.status = 'sold';
            await game.save();
        }

        const newOrder = new Order({
            user: req.user.id,
            items: items.map(item => ({
                game: item._id,
                title: item.title,
                price: item.price,
                image: item.images[0]
            })),
            totalAmount: Math.round(totalAmount - discountAmount),
            discountAmount,
            billingInfo,
            paymentMethod,
            deliveredAccounts,
            status: 'Completed'
        });
        await newOrder.save();

        // Clear user's cart
        await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'username email fullName phoneNumber address').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
