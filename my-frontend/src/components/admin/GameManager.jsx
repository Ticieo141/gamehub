import React, { useState, useEffect, useMemo } from 'react';
import { gameService } from '../../api/gameService';
import { adminService } from '../../api/adminService';
import ImageUpload from '../common/ImageUpload';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { Search, ChevronUp, ChevronDown, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import ConfirmModal from '../common/ConfirmModal';

const GameManager = () => {
    const { t } = useLanguage();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [showCredentials, setShowCredentials] = useState(false);
    
    // Search and Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

    const [formData, setFormData] = useState({
        title: '',
        gameName: '',
        price: '',
        images: [],
        description: '',
        accountDetails: {
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await gameService.getAllGames({ isAdmin: 'true' });
            setGames(data);
        } catch (err) {
            console.error("Error fetching games:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (game) => {
        setEditingGame(game);
        setFormData({
            title: game.title,
            gameName: game.gameName,
            price: game.price,
            images: game.images || [],
            description: game.description || '',
            accountDetails: {
                username: game.accountDetails?.username || '',
                password: game.accountDetails?.password || ''
            }
        });
        setShowModal(true);
    };

    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null });

    const handleDelete = (id) => {
        setConfirmConfig({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        try {
            await adminService.deleteGame(confirmConfig.id);
            setGames(games.filter(g => g._id !== confirmConfig.id));
        } catch (err) {
            alert(t('admin_games_error_delete') + ': ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGame) {
                await adminService.updateGame(editingGame._id, formData);
            } else {
                await adminService.createGame(formData);
            }
            setShowModal(false);
            fetchGames();
            setEditingGame(null);
            setFormData({
                title: '',
                gameName: '',
                price: '',
                images: [],
                description: '',
                accountDetails: { username: '', password: '' }
            });
            alert(t('admin_games_save_success'));
        } catch (err) {
            alert(t('admin_games_error_save') + ': ' + err.message);
        }
    };

    // Filter and Sort Logic
    const filteredAndSortedGames = useMemo(() => {
        let result = [...games];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(game => 
                game.title.toLowerCase().includes(query) || 
                game.gameName.toLowerCase().includes(query)
            );
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [games, searchQuery, sortConfig]);

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

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>{t('common_loading')}...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>{t('admin_games_title_1')} <span className="gradient-text">{t('admin_games_subtitle')}</span></h1>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {/* Search Bar */}
                    <div style={{ position: 'relative', width: '250px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '10px 12px 10px 35px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid var(--glass-border)', 
                                borderRadius: '10px', 
                                color: 'white',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button className="btn-primary" onClick={() => { setEditingGame(null); setFormData({ title: '', gameName: '', price: '', images: [], description: '', accountDetails: { username: '', password: '' } }); setShowModal(true); }} style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> {t('admin_games_btn_add')}
                    </button>
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('title')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_games_col_title')} {getSortIcon('title')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('gameName')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_games_col_game')} {getSortIcon('gameName')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('price')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_games_col_price')} {getSortIcon('price')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('status')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_games_col_status')} {getSortIcon('status')}
                                </div>
                            </th>
                            <th style={{ padding: '20px' }}>{t('admin_orders_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedGames.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Không tìm thấy sản phẩm nào.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedGames.map(game => (
                                <tr key={game._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img src={game.images && game.images[0] && (game.images[0].startsWith('/') ? `http://localhost:5000${game.images[0]}` : game.images[0])} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <span style={{ fontWeight: '500' }}>{game.title}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{game.gameName}</td>
                                    <td style={{ padding: '20px', fontWeight: 'bold' }}>{formatPrice(game.price)}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            background: game.status === 'available' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                                            color: game.status === 'available' ? '#2ecc71' : '#e74c3c',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            {game.status === 'available' ? t('admin_games_status_available') : t('admin_games_status_sold')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button onClick={() => handleEdit(game)} style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Edit2 size={16} /> {t('profile_btn_update')}
                                            </button>
                                            <button onClick={() => handleDelete(game._id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Trash2 size={16} /> {t('cart_remove')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal remains largely same with styling tweaks */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '30px' }}>{editingGame ? t('admin_games_modal_edit') : t('admin_games_modal_add')}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-group">
                                <label>{t('admin_games_form_title')}</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="Ví dụ: Tài khoản cấp 250 - Có đủ DLC" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>{t('admin_games_form_game')}</label>
                                    <input type="text" value={formData.gameName} onChange={e => setFormData({ ...formData, gameName: e.target.value })} required placeholder="Ví dụ: Elden Ring" />
                                </div>
                                <div className="input-group">
                                    <label>{t('admin_games_form_price')}</label>
                                    <input type="number" step="1000" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>{t('admin_games_form_images')}</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginBottom: '10px' }}>
                                    {formData.images.map((img, index) => (
                                        <div key={index} style={{ position: 'relative', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                            <img src={img.startsWith('/') ? `http://localhost:5000${img}` : img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const newImages = [...formData.images];
                                                    newImages.splice(index, 1);
                                                    setFormData({ ...formData, images: newImages });
                                                }}
                                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(231, 76, 60, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold' }}
                                            >✕</button>
                                        </div>
                                    ))}
                                    <ImageUpload 
                                        onUploadSuccess={(urls) => {
                                            const newImages = Array.isArray(urls) ? urls : [urls];
                                            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
                                        }}
                                        label=""
                                        multiple={true}
                                    />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('support_desc_detail')}</p>
                            </div>
                            <div className="input-group">
                                <label>{t('admin_games_form_desc')}</label>
                                <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', padding: '15px' }}></textarea>
                            </div>

                            <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid var(--accent-primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h4 style={{ margin: 0 }}>{t('admin_games_form_creds')}</h4>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCredentials(!showCredentials)}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                                    >
                                        {showCredentials ? t('admin_games_creds_hide') : t('admin_games_creds_show')}
                                    </button>
                                </div>
                                
                                {showCredentials ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="input-group">
                                            <label>{t('order_credential_user')}</label>
                                            <input
                                                type="text"
                                                value={formData.accountDetails.username}
                                                onChange={(e) => setFormData({ ...formData.accountDetails, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>{t('order_credential_pass')}</label>
                                            <input
                                                type="text"
                                                value={formData.accountDetails.password}
                                                onChange={(e) => setFormData({ ...formData.accountDetails, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', py: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {t('admin_games_creds_hidden_note')}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingGame ? t('profile_btn_update') : t('support_btn_submit')}</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{t('details_back_store')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal 
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmDelete}
                title={t('common_confirm')}
                message={t('admin_games_delete_confirm')}
            />

            <style>{`
                tbody tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
            `}</style>
        </div>
    );
};

export default GameManager;
