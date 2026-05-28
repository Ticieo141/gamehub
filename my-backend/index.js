import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/database.js';
import apiRoutes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// MongoDB Connection
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error', 
        error: err.message 
    });
});

// Basic Route
app.get('/', (req, res) => {
    res.send('GameHub API is running with MVC Architecture...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
