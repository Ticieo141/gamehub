import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
        title: String,
        price: Number,
        image: String
    }],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    billingInfo: {
        firstName: String,
        lastName: String,
        email: String,
        address: String,
        phone: String
    },
    paymentMethod: { type: String, default: 'Credit Card' },
    deliveredAccounts: [{
        gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
        title: String,
        username: String,
        password: String
    }],
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
