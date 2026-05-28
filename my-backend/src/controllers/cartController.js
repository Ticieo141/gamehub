import User from '../models/User.js';
import Game from '../models/Game.js';

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { gameId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { cart: gameId } },
            { new: true }
        ).populate('cart');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { gameId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { cart: gameId } },
            { new: true }
        ).populate('cart');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
