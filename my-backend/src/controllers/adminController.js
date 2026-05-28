import Game from '../models/Game.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

export const getStats = async (req, res) => {
    try {
        const totalGames = await Game.countDocuments();
        const totalUsers = await User.countDocuments();
        const orders = await Order.find().populate('user', 'username');

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Get recent activity (last 5 orders and last 5 new users)
        const recentOrders = await Order.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentUsers = await User.find()
            .select('username createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentActivity = [
            ...recentOrders.map(o => ({ type: 'Order', description: `New order from ${o.user?.username || 'Unknown'}`, amount: o.totalAmount, date: o.createdAt })),
            ...recentUsers.map(u => ({ type: 'User', description: `New operative ${u.username} joined`, date: u.createdAt }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

        // Mock revenue trend for the last 7 days for the chart
        const revenueData = [
            { day: 'Mon', amount: totalRevenue * 0.1 },
            { day: 'Tue', amount: totalRevenue * 0.15 },
            { day: 'Wed', amount: totalRevenue * 0.12 },
            { day: 'Thu', amount: totalRevenue * 0.18 },
            { day: 'Fri', amount: totalRevenue * 0.25 },
            { day: 'Sat', amount: totalRevenue * 0.14 },
            { day: 'Sun', amount: totalRevenue * 0.06 }
        ];

        res.json({
            totalGames,
            totalUsers,
            totalOrders,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            recentActivity,
            revenueData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
