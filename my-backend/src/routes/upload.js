import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Use memory storage for initial processing
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Helper to save a file buffer to GridFS
 */
const saveToGridFS = async (file) => {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'uploads'
    });

    const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.mimetype
    });

    return new Promise((resolve, reject) => {
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        
        readableStream.pipe(uploadStream)
            .on('error', (err) => {
                console.error('❌ GridFS Upload Stream Error:', err);
                reject(err);
            })
            .on('finish', () => {
                resolve({
                    filename: filename,
                    id: uploadStream.id
                });
            });
    });
};

/**
 * @route   POST /api/upload
 * @desc    Upload single file to MongoDB GridFS
 */
router.post('/', (req, res, next) => {
    console.log('📥 Single upload request received');
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ success: false, message: 'Chưa kết nối được Database. Vui lòng thử lại sau.' });
    }
    next();
}, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('❌ Multer Single Upload Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Multer error during single upload',
                error: err.message
            });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await saveToGridFS(req.file);
        console.log('✅ Single upload successful:', result.filename);
        
        const imageUrl = `/api/upload/image/${result.filename}`;
        res.json({
            success: true,
            file: { ...req.file, filename: result.filename, id: result.id },
            url: imageUrl
        });
    } catch (err) {
        console.error('❌ GridFS Single Save Error:', err);
        res.status(500).json({ success: false, message: 'Error saving to GridFS', error: err.message });
    }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files to MongoDB GridFS
 */
router.post('/multiple', (req, res, next) => {
    upload.array('files', 10)(req, res, (err) => {
        if (err) {
            console.error('❌ Multer Multiple Upload Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Multer error during multiple upload',
                error: err.message
            });
        }
        next();
    });
}, (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ success: false, message: 'Chưa kết nối được Database. Vui lòng thử lại sau.' });
    }
    next();
}, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        console.log(`⏳ Saving ${req.files.length} files to GridFS...`);
        const uploadPromises = req.files.map(file => saveToGridFS(file));
        const results = await Promise.all(uploadPromises);
        
        console.log('✅ Multiple upload successful, count:', results.length);

        const fileInfos = results.map(result => ({
            filename: result.filename,
            url: `/api/upload/image/${result.filename}`
        }));

        res.json({
            success: true,
            files: fileInfos
        });
    } catch (err) {
        console.error('❌ GridFS Multiple Save Error:', err);
        res.status(500).json({ success: false, message: 'Error saving to GridFS', error: err.message });
    }
});

/**
 * @route   GET /api/upload/image/:filename
 * @desc    Retrieve and stream image from MongoDB GridFS
 */
router.get('/image/:filename', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'uploads'
        });

        const files = await bucket.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }

        // Set content type if possible (optional but good practice)
        if (files[0].contentType) {
            res.set('Content-Type', files[0].contentType);
        }

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
        downloadStream.pipe(res);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

/**
 * @route   DELETE /api/upload/image/:filename
 * @desc    Delete image from MongoDB GridFS
 */
router.delete('/image/:filename', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'uploads'
        });

        const files = await bucket.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }

        await bucket.delete(files[0]._id);
        res.json({ success: true, message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

export default router;
