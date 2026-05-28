import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Orders & Billing', 'Technical Support', 'Account Safety'], required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', ticketSchema);
