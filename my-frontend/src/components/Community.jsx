import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageCircle, 
    ThumbsUp, 
    Share2, 
    Image as ImageIcon, 
    MoreHorizontal, 
    Globe, 
    Smile, 
    Video,
    Send,
    X,
    Heart,
    MapPin,
    Tag,
    Plus,
    ChevronLeft,
    ChevronRight,
    ThumbsUp as ThumbsUpIcon
} from 'lucide-react';
import { communityService } from '../api/communityService';
import { useLanguage } from '../context/LanguageContext';
import ImageUpload from './common/ImageUpload';

const timeAgo = (date, lang) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return lang === 'vi' ? 'vừa xong' : 'just now';
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (lang === 'vi' ? ' năm trước' : ' years ago');
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (lang === 'vi' ? ' tháng trước' : ' months ago');
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (lang === 'vi' ? ' ngày trước' : ' days ago');
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (lang === 'vi' ? ' giờ trước' : ' hours ago');
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (lang === 'vi' ? ' phút trước' : ' minutes ago');
    return lang === 'vi' ? 'vừa xong' : 'just now';
};

const CreatePostBox = ({ user, onOpenModal, t }) => {
    return (
        <div className="glass" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {user?.fullName ? user.fullName[0].toUpperCase() : user?.username?.[0].toUpperCase() || '?'}
                </div>
                <button 
                    onClick={onOpenModal}
                    style={{ 
                        flex: 1, 
                        background: 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        borderRadius: '25px', 
                        padding: '12px 20px', 
                        textAlign: 'left', 
                        color: 'var(--text-muted)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                >
                    {t('community_whats_on_your_mind')} {user?.username}?
                </button>
            </div>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-around' }}>
                <button onClick={onOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '8px 15px', borderRadius: '8px' }}>
                    <ImageIcon size={20} color="#45bd62" /> <span>Ảnh/video</span>
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '8px 15px', borderRadius: '8px' }}>
                    <Smile size={20} color="#f7b928" /> <span>Cảm xúc/hoạt động</span>
                </button>
            </div>
        </div>
    );
};

const PostCard = ({ post, user, onLike, onReply, onImageClick, t, lang }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [replyTo, setReplyTo] = useState(null); // { id, username }
    const isLiked = post.likes?.includes(user?.id);
    
    // Group replies by parentId
    const rootReplies = post.replies?.filter(r => !r.parentId) || [];
    const getNestedReplies = (parentId) => post.replies?.filter(r => r.parentId === parentId) || [];

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onReply(post._id, commentText, replyTo?.id);
        setCommentText('');
        setReplyTo(null);
    };

    const handleReplyClick = (reply) => {
        setReplyTo({ id: reply._id || reply.id, username: reply.user?.username });
        if (!showComments) setShowComments(true);
    };

    return (
        <div className="glass" style={{ padding: '15px 0', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden' }}>
            {/* Post Header */}
            <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {post.user?.avatar ? (
                        <img 
                            src={post.user.avatar.startsWith('/') ? `http://localhost:5000${post.user.avatar}` : post.user.avatar} 
                            alt="Avatar" 
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <div style={{ 
                            width: '42px', 
                            height: '42px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            {post.user?.username?.[0].toUpperCase() || '?'}
                        </div>
                    )}
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {post.user?.username}
                            {post.category && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', background: 'rgba(56,189,248,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                    {post.category}
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {timeAgo(post.createdAt, lang)} • <Globe size={12} />
                        </div>
                    </div>
                </div>
                <button style={{ color: 'var(--text-muted)' }}><MoreHorizontal size={20} /></button>
            </div>

            {/* Post Content */}
            <div style={{ padding: '0 20px 15px', fontSize: '1.05rem', lineHeight: '1.5' }}>
                {post.content}
            </div>

            {/* Improved Media Gallery */}
            {post.images && post.images.length > 0 && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                    gridAutoRows: post.images.length === 3 ? '200px' : 'auto',
                    gap: '4px',
                    marginBottom: '15px',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {post.images.slice(0, 4).map((url, idx) => {
                        const isLast = idx === 3 && post.images.length > 4;
                        const gridStyle = {};
                        
                        if (post.images.length === 3) {
                            if (idx === 0) gridStyle.gridColumn = 'span 2';
                        } else if (post.images.length === 1) {
                            gridStyle.maxHeight = '500px';
                        }

                        return (
                            <div 
                                key={idx} 
                                onClick={() => onImageClick(post.images, idx)}
                                style={{ 
                                    position: 'relative', 
                                    aspectRatio: post.images.length === 1 ? 'auto' : '1/1', 
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    ...gridStyle
                                }}
                            >
                                <img 
                                    src={url.startsWith('/') ? `http://localhost:5000${url}` : url} 
                                    alt="" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }} 
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                {isLast && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        inset: 0, 
                                        background: 'rgba(0,0,0,0.6)', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        color: 'white', 
                                        fontSize: '2rem', 
                                        fontWeight: 'bold',
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        +{post.images.length - 4}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Post Stats */}
            <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {post.likes?.length > 0 && (
                        <>
                            <div style={{ width: '18px', height: '18px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ThumbsUpIcon size={10} color="white" fill="white" />
                            </div>
                            <span>{post.likes.length}</span>
                        </>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <span onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer' }}>{post.replies?.length || 0} {t('community_action_comment')}</span>
                    <span>0 {t('community_action_share')}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ margin: '0 20px', borderTop: '1px solid var(--glass-border)', borderBottom: showComments ? '1px solid var(--glass-border)' : 'none', padding: '4px 0', display: 'flex' }}>
                <button 
                    onClick={(e) => onLike(e, post._id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '6px', color: isLiked ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: '0.2s' }}
                    className="fb-action-btn"
                >
                    <ThumbsUpIcon size={20} fill={isLiked ? 'var(--accent-primary)' : 'none'} />
                    <span style={{ fontWeight: '600' }}>{t('community_action_like')}</span>
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '6px', color: 'var(--text-secondary)', transition: '0.2s' }}
                    className="fb-action-btn"
                >
                    <MessageCircle size={20} />
                    <span style={{ fontWeight: '600' }}>{t('community_action_comment')}</span>
                </button>
                <button 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '6px', color: 'var(--text-secondary)', transition: '0.2s' }}
                    className="fb-action-btn"
                >
                    <Share2 size={20} />
                    <span style={{ fontWeight: '600' }}>{t('community_action_share')}</span>
                </button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {rootReplies.map((reply, idx) => {
                                const nested = getNestedReplies(reply._id || reply.id);
                                return (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {reply.user?.avatar ? (
                                                <img 
                                                    src={reply.user.avatar.startsWith('/') ? `http://localhost:5000${reply.user.avatar}` : reply.user.avatar} 
                                                    alt="Avatar" 
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                                                />
                                            ) : (
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                    {reply.user?.username?.[0].toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '18px', width: 'fit-content', maxWidth: '100%' }}>
                                                    <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '2px' }}>{reply.user?.username}</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{reply.content}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '15px', padding: '4px 15px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                                                    <span style={{ cursor: 'pointer' }}>Thích</span>
                                                    <span style={{ cursor: 'pointer' }} onClick={() => handleReplyClick(reply)}>Phản hồi</span>
                                                    <span>{timeAgo(reply.createdAt, lang)}</span>
                                                </div>
                                                
                                                {/* Nested Replies */}
                                                {nested.length > 0 && (
                                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        {nested.map((nr, nidx) => (
                                                            <div key={nidx} style={{ display: 'flex', gap: '10px' }}>
                                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                                                    {nr.user?.username?.[0].toUpperCase() || '?'}
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '15px', width: 'fit-content', maxWidth: '100%' }}>
                                                                        <span style={{ fontWeight: '700', fontSize: '0.8rem', marginRight: '6px' }}>{nr.user?.username}</span>
                                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{nr.content}</span>
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '12px', padding: '2px 12px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                                                                        <span style={{ cursor: 'pointer' }}>Thích</span>
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => handleReplyClick(reply)}>Phản hồi</span>
                                                                        <span>{timeAgo(nr.createdAt, lang)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Write Comment Box */}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                    {user?.username?.[0].toUpperCase() || '?'}
                                </div>
                                <form onSubmit={handleCommentSubmit} style={{ flex: 1 }}>
                                    {replyTo && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Đang phản hồi <strong>{replyTo.username}</strong>
                                            <X size={12} cursor="pointer" onClick={() => setReplyTo(null)} />
                                        </div>
                                    )}
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input 
                                                placeholder={t('community_write_comment')}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                style={{ 
                                                    width: '100%', 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    border: 'none', 
                                                    borderRadius: '20px', 
                                                    padding: '10px 45px 10px 15px', 
                                                    color: 'white',
                                                    fontSize: '0.9rem'
                                                }}
                                                autoFocus={!!replyTo}
                                            />
                                            <button 
                                                type="submit"
                                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: commentText ? 'var(--accent-primary)' : 'var(--text-muted)', background: 'none' }}
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', padding: '0 5px' }}>
                                            {['❤️', '😂', '😮', '😢', '😡', '👍', '🔥'].map(emoji => (
                                                <span 
                                                    key={emoji} 
                                                    onClick={() => setCommentText(prev => prev + emoji)}
                                                    style={{ cursor: 'pointer', fontSize: '1.1rem', transition: '0.2s', opacity: 0.8 }}
                                                    onMouseOver={(e) => { e.target.style.transform = 'scale(1.2)'; e.target.style.opacity = '1'; }}
                                                    onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.opacity = '0.8'; }}
                                                >
                                                    {emoji}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Community = () => {
    const { t, lang } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ content: '', category: 'Discussion', images: [] });
    const [isUploading, setIsUploading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });
    
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const fetchPosts = async () => {
        try {
            const data = await communityService.getAllPosts();
            setPosts(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLightboxPrev = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({
            ...prev,
            index: (prev.index - 1 + prev.images.length) % prev.images.length
        }));
    };

    const handleLightboxNext = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({
            ...prev,
            index: (prev.index + 1) % prev.images.length
        }));
    };

    const handleLightboxClose = () => {
        setLightbox({ ...lightbox, isOpen: false });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleUploadSuccess = (urls) => {
        const newUrls = Array.isArray(urls) ? urls : [urls];
        setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, ...newUrls] 
        }));
    };

    const removeMedia = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return alert(t('community_login_alert_post'));
        if (!formData.content.trim() && formData.images.length === 0) return;

        setIsUploading(true);
        try {
            await communityService.createPost({ 
                ...formData, 
                title: formData.content.trim().slice(0, 50) || 'Post by ' + user?.username
            });
            
            setShowModal(false);
            setFormData({ content: '', category: 'Discussion', images: [] });
            fetchPosts();
            alert("Bài viết của bạn đã được gửi và đang chờ quản trị viên phê duyệt.");
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Có lỗi xảy ra khi đăng bài!");
        } finally {
            setIsUploading(false);
        }
    };

    const handleReply = async (postId, content, parentId) => {
        if (!token) return alert(t('community_login_alert_reply'));
        try {
            const updatedPost = await communityService.addReply(postId, content, parentId);
            setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        } catch (err) {
            console.error("Error adding reply:", err);
        }
    };

    const handleLike = async (e, postId) => {
        e.stopPropagation();
        if (!token) return alert(t('community_login_alert_like'));
        try {
            const updatedPostData = await communityService.toggleLike(postId);
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: updatedPostData.likes } : p));
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    return (
        <section className="section" style={{ background: 'rgba(2, 6, 23, 0.5)', minHeight: '100vh', paddingTop: '40px' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 15px' }}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{t('community_title')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('community_desc')}</p>
                </div>

                <CreatePostBox user={user} t={t} onOpenModal={() => setShowModal(true)} />

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div className="loader" style={{ margin: '0 auto' }}></div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {posts.length === 0 ? (
                            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                                <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '20px', margin: '0 auto' }} />
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{t('community_empty')}</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <PostCard 
                                    key={post._id} 
                                    post={post} 
                                    user={user} 
                                    onLike={handleLike} 
                                    onReply={handleReply} 
                                    t={t}
                                    lang={lang}
                                    onImageClick={(images, index) => setLightbox({ isOpen: true, images, index })}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Post Creation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => !isUploading && setShowModal(false)} 
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)' }}
                        ></motion.div>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass" 
                            style={{ padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '550px', position: 'relative', border: '1px solid var(--glass-border)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', position: 'relative' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Đăng bài</h3>
                                <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: 0, top: 0, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {user?.username?.[0].toUpperCase() || '?'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700' }}>{user?.username}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Globe size={10} /> Công khai
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                                    <textarea
                                        required={formData.images.length === 0}
                                        rows="4"
                                        placeholder={`${t('community_whats_on_your_mind')} ${user?.username}?`}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        style={{ 
                                            width: '100%', 
                                            background: 'transparent', 
                                            border: 'none', 
                                            fontSize: '1.2rem', 
                                            color: 'white', 
                                            resize: 'none',
                                            padding: '0',
                                            outline: 'none',
                                            minHeight: '100px'
                                        }}
                                    />
                                    
                                    {/* Preview Gallery */}
                                    {formData.images.length > 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '15px' }}>
                                            {formData.images.map((url, index) => (
                                                <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
                                                    <img src={url.startsWith('/') ? `http://localhost:5000${url}` : url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeMedia(index)}
                                                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div style={{ position: 'relative', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ImageUpload 
                                                    onUploadSuccess={handleUploadSuccess}
                                                    label=""
                                                    multiple={true}
                                                    onUploadStart={() => setIsImageUploading(true)}
                                                    onUploadEnd={() => setIsImageUploading(false)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Thêm vào bài viết của bạn</span>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <ImageUpload 
                                            onUploadSuccess={handleUploadSuccess}
                                            label=""
                                            multiple={true}
                                            style={{ width: '24px', height: '24px' }}
                                            onUploadStart={() => setIsImageUploading(true)}
                                            onUploadEnd={() => setIsImageUploading(false)}
                                        >
                                            <ImageIcon size={24} color="#45bd62" style={{ cursor: 'pointer' }} />
                                        </ImageUpload>
                                        <Smile size={24} color="#f7b928" cursor="pointer" />
                                        <MapPin size={24} color="#f3425f" cursor="pointer" />
                                        <Tag size={24} color="#1877f2" cursor="pointer" />
                                        <Heart size={24} color="#ef4444" cursor="pointer" />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    disabled={isUploading || isImageUploading || (!formData.content.trim() && formData.images.length === 0)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', opacity: (isUploading || isImageUploading || (!formData.content.trim() && formData.images.length === 0)) ? 0.5 : 1 }}
                                >
                                    {isUploading ? 'Đang đăng...' : isImageUploading ? 'Đang xử lý ảnh...' : 'Đăng'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .fb-action-btn:hover {
                    background: rgba(255,255,255,0.08) !important;
                }
                .loader {
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top: 3px solid var(--accent-primary);
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightbox.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleLightboxClose}
                        style={{ 
                            position: 'fixed', 
                            inset: 0, 
                            zIndex: 2000, 
                            background: 'rgba(0,0,0,0.95)', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* Close button */}
                        <button 
                            onClick={handleLightboxClose}
                            style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '10px', display: 'flex' }}
                        >
                            <X size={24} />
                        </button>

                        {/* Image Container */}
                        <div style={{ position: 'relative', width: '90vw', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {lightbox.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={handleLightboxPrev}
                                        style={{ position: 'absolute', left: '0', zIndex: 10, color: 'white', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '50%', display: 'flex' }}
                                    >
                                        <ChevronLeft size={30} />
                                    </button>
                                    <button 
                                        onClick={handleLightboxNext}
                                        style={{ position: 'absolute', right: '0', zIndex: 10, color: 'white', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '50%', display: 'flex' }}
                                    >
                                        <ChevronRight size={30} />
                                    </button>
                                </>
                            )}
                            
                            <motion.img 
                                key={lightbox.index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={lightbox.images[lightbox.index].startsWith('/') ? `http://localhost:5000${lightbox.images[lightbox.index]}` : lightbox.images[lightbox.index]} 
                                alt="" 
                                onClick={(e) => e.stopPropagation()}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} 
                            />
                        </div>

                        {/* Image Info */}
                        <div style={{ marginTop: '20px', color: 'white', fontSize: '1rem', fontWeight: '500', background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '20px' }}>
                            {lightbox.index + 1} / {lightbox.images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Community;
