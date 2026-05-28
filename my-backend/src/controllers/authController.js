import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/emailService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            verificationToken,
            isVerified: false
        });
        
        await newUser.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (err) {
            console.error('Email sending failed, but user was created:', err);
            // Optionally: keep user but inform them they might need to resend verification
        }

        res.status(201).json({ 
            message: 'User created successfully. Please check your email to verify your account.' 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(401).json({ 
                message: 'Please verify your email address before logging in.',
                requiresVerification: true
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Tài khoản đã được xác nhận rồi' });
        }

        // Generate new token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();

        await sendVerificationEmail(email, verificationToken);

        res.json({ message: 'Đã gửi lại email xác nhận! Vui lòng kiểm tra hộp thư của bạn.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture, email_verified } = payload;
        
        if (!email_verified) {
            return res.status(400).json({ message: 'Google email is not verified' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            let baseUsername = email.split('@')[0];
            let uniqueUsername = baseUsername;
            let counter = 1;
            while (await User.findOne({ username: uniqueUsername })) {
                uniqueUsername = `${baseUsername}${counter}`;
                counter++;
            }

            user = new User({
                googleId: sub,
                username: uniqueUsername,
                email,
                fullName: name,
                avatar: picture,
                isVerified: true
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = sub;
            user.isVerified = true;
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: jwtToken, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
