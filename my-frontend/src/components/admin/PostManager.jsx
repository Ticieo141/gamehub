import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../api/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { MessageCircle, Trash2, ExternalLink, User, Eye, EyeOff, X, Clock, CheckCircle, AlertCircle, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostManager = () => {
    const { t } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Search and Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        setLoading(true);
        adminService.getPosts()
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching posts:", err);
                setLoading(false);
            });
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const updated = await adminService.updatePostStatus(id, status);
            setPosts(posts.map(p => p._id === id ? updated : p));
            if (selectedPost && selectedPost._id === id) setSelectedPost(updated);
        } catch (err) {
            alert("Error updating status: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin_games_confirm_delete') || 'Are you sure you want to delete this post?')) {
            try {
                await adminService.deletePost(id);
                setPosts(posts.filter(p => p._id !== id));
                if (selectedPost && selectedPost._id === id) setShowModal(false);
            } catch (err) {
                alert("Error deleting post: " + err.message);
            }
        }
    };

    const openDetails = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    // Filter and Sort Logic
    const filteredAndSortedPosts = useMemo(() => {
        let result = [...posts];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post => 
                post.content.toLowerCase().includes(query) || 
                post.user?.username.toLowerCase().includes(query) ||
                post.user?.email.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;
                
                if (sortConfig.key === 'author') {
                    aValue = a.user?.username || '';
                    bValue = b.user?.username || '';
                } else {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [posts, searchQuery, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>
                    {t('admin_nav_posts').split(' ')[0]} <span className="gradient-text">{t('admin_nav_posts').split(' ').slice(1).join(' ')}</span>
                </h1>

                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo nội dung, tác giả..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px 15px 12px 45px', 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid var(--glass-border)', 
                            borderRadius: '12px', 
                            color: 'white',
                            outline: 'none',
                            transition: 'border-color 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th 
                                style={{ padding: '20px', cursor: 'pointer', userSelect: 'none' }} 
                                onClick={() => requestSort('author')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_posts_col_author')} {getSortIcon('author')}
                                </div>
                            </th>
                            <th 
                                style={{ padding: '20px', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => requestSort('content')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_posts_col_content')} {getSortIcon('content')}
                                </div>
                            </th>
                            <th 
                                style={{ padding: '20px', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => requestSort('status')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Trạng thái {getSortIcon('status')}
                                </div>
                            </th>
                            <th style={{ padding: '20px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedPosts.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có bài viết nào.'}
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedPosts.map(post => (
                                <tr key={post._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                {post.user?.username?.[0].toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{post.user?.username || 'Anonymous'}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ maxWidth: '400px', fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.content}
                                        </div>
                                        <button 
                                            onClick={() => openDetails(post)}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '4px', padding: 0 }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <StatusBadge status={post.status} />
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            {post.status === 'pending' && (
                                                <button
                                                    title="Phê duyệt"
                                                    onClick={() => handleStatusUpdate(post._id, 'approved')}
                                                    style={{ background: 'none', border: 'none', color: '#2ecc71', cursor: 'pointer' }}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {post.status === 'approved' ? (
                                                <button
                                                    title="Ẩn bài viết"
                                                    onClick={() => handleStatusUpdate(post._id, 'hidden')}
                                                    style={{ background: 'none', border: 'none', color: '#f1c40f', cursor: 'pointer' }}
                                                >
                                                    <EyeOff size={18} />
                                                </button>
                                            ) : post.status === 'hidden' ? (
                                                <button
                                                    title="Hiện bài viết"
                                                    onClick={() => handleStatusUpdate(post._id, 'approved')}
                                                    style={{ background: 'none', border: 'none', color: '#2ecc71', cursor: 'pointer' }}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            ) : null}
                                            <button
                                                title="Xóa bài viết"
                                                onClick={() => handleDelete(post._id)}
                                                style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Post Detail Modal */}
            {showModal && selectedPost && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div 
                        onClick={() => setShowModal(false)}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
                    ></div>
                    <div className="glass" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', position: 'relative', padding: '30px' }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', right: '20px', top: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                {selectedPost.user?.username?.[0].toUpperCase() || '?'}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedPost.user?.username}</h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedPost.user?.email} • {new Date(selectedPost.createdAt).toLocaleString()}</div>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <StatusBadge status={selectedPost.status} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                                {selectedPost.content}
                            </div>
                        </div>

                        {selectedPost.images && selectedPost.images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                {selectedPost.images.map((url, i) => (
                                    <img key={i} src={url.startsWith('/') ? `http://localhost:5000${url}` : url} alt="" style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }} />
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                            {selectedPost.status === 'pending' && (
                                <button className="btn-primary" onClick={() => handleStatusUpdate(selectedPost._id, 'approved')} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Phê duyệt</button>
                            )}
                            {selectedPost.status === 'approved' && (
                                <button className="btn-secondary" onClick={() => handleStatusUpdate(selectedPost._id, 'hidden')} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Ẩn bài viết</button>
                            )}
                            {selectedPost.status === 'hidden' && (
                                <button className="btn-primary" onClick={() => handleStatusUpdate(selectedPost._id, 'approved')} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Hiện bài viết</button>
                            )}
                            <button className="btn-secondary" onClick={() => handleDelete(selectedPost._id)} style={{ padding: '8px 20px', fontSize: '0.9rem', color: '#e74c3c' }}>Xóa vĩnh viễn</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
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
                tbody tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
            `}</style>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        approved: { label: 'Đã duyệt', color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.2)', icon: <CheckCircle size={12} /> },
        pending: { label: 'Chờ duyệt', color: '#f1c40f', bg: 'rgba(241, 196, 15, 0.2)', icon: <Clock size={12} /> },
        rejected: { label: 'Từ chối', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.2)', icon: <AlertCircle size={12} /> },
        hidden: { label: 'Đang ẩn', color: '#95a5a6', bg: 'rgba(149, 165, 166, 0.2)', icon: <EyeOff size={12} /> }
    };

    const { label, color, bg, icon } = config[status] || config.pending;

    return (
        <span style={{ 
            padding: '4px 10px', 
            borderRadius: '6px', 
            fontSize: '0.75rem', 
            background: bg,
            color: color,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
        }}>
            {icon} {label}
        </span>
    );
};

export default PostManager;
