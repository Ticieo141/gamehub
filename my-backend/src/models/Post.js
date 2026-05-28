import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Discussion', 'Guides', 'Media', 'Matchmaking'], default: 'Discussion' },
    replies: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
        parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
        createdAt: { type: Date, default: Date.now }
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    images: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'hidden'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
