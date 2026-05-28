import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'badipa5765@cosdas.com'; // Change this if different
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:');
            console.log('Email:', user.email);
            console.log('isVerified:', user.isVerified);
            console.log('verificationToken:', user.verificationToken);
        } else {
            console.log('User not found with email:', email);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUser();
