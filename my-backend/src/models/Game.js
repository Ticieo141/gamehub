import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    gameName: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    description: { type: String },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    accountDetails: {
        username: { type: String, default: '' },
        password: { type: String, default: '' },
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Game', gameSchema);
