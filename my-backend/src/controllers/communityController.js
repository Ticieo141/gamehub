import Post from '../models/Post.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ status: 'approved' })
            .populate('user', 'username avatar')
            .populate('replies.user', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAdminPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, category, images } = req.body;
        const newPost = new Post({
            user: req.user.id,
            title,
            content,
            category,
            images
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addReply = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.replies.push({ user: req.user.id, content, parentId: parentId || null });
        await post.save();
        
        const updatedPost = await Post.findById(req.params.id)
            .populate('user', 'username')
            .populate('replies.user', 'username');
            
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = post.likes.indexOf(req.user.id);
        if (index === -1) {
            post.likes.push(req.user.id);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updatePostStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected', 'hidden'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('user', 'username email');
        
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
