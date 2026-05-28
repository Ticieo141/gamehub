import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
    try {
        const { subject, description, category } = req.body;
        const newTicket = new Ticket({
            user: req.user.id,
            subject,
            description,
            category
        });
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
