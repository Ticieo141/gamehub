import User from '../models/User.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, address, dob, gender, billingInfo, avatar } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (fullName !== undefined) user.fullName = fullName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (address !== undefined) user.address = address;
        if (dob !== undefined) user.dob = dob;
        if (gender !== undefined) user.gender = gender;
        if (billingInfo !== undefined) user.billingInfo = billingInfo;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
