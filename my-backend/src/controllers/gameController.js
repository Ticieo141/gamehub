import Game from '../models/Game.js';

export const getAllGames = async (req, res) => {
    try {
        const { gameName, search, sort } = req.query;
        let query = {};

        if (gameName) query.gameName = gameName;
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Only show available accounts to non-admins
        if (req.query.isAdmin !== 'true') {
            query.status = 'available';
        }

        let sortOptions = {};
        switch (sort) {
            case 'price_low':
                sortOptions.price = 1;
                break;
            case 'price_high':
                sortOptions.price = -1;
                break;
            case 'newest':
                sortOptions.createdAt = -1;
                break;
            case 'popularity':
            default:
                sortOptions.createdAt = -1; // Default to newest if popularity field not available
                break;
        }

        const games = await Game.find(query).sort(sortOptions);
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createGame = async (req, res) => {
    try {
        const newGame = new Game(req.body);
        await newGame.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateGame = async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGame) return res.status(404).json({ message: 'Game not found' });
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const deletedGame = await Game.findByIdAndDelete(req.params.id);
        if (!deletedGame) return res.status(404).json({ message: 'Game not found' });
        res.json({ message: 'Game deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
