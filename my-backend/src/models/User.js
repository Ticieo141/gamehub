import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function() { return !this.googleId; }
    },
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    fullName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], default: 'Prefer not to say' },
    billingInfo: {
        cardNumber: { type: String, default: '' },
        cardExpiry: { type: String, default: '' },
        billingAddress: { type: String, default: '' }
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
