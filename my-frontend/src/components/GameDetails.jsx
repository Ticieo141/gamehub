import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { gameService } from '../api/gameService';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';

const GameDetails = ({ onBack, onAddToCart, purchasedGames = [] }) => {
    const { t } = useLanguage();
    const { id } = useParams();
    const location = useLocation();
    const [game, setGame] = useState(location.state?.game || null);
    const [loading, setLoading] = useState(!game);
    const [activeImage, setActiveImage] = useState(0);

    // Check if the user already owns this game account (not needed anymore, but let's keep it safe)
    const isOwned = purchasedGames.some(p => p._id === (game?._id || id));

    useEffect(() => {
        if (!game && id) {
            setLoading(true);
            gameService.getGameById(id)
                .then(data => {
                    setGame(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching game details:", err);
                    setLoading(false);
                });
        }
    }, [id, game]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('details_loading')}</div>
        </div>
    );

    if (!game) return (
        <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
            <h2>{t('details_not_found')}</h2>
            <button onClick={onBack} className="btn-primary">{t('details_back_store')}</button>
        </div>
    );

    return (
        <div className="section fade-in" style={{ marginTop: '40px' }}>
            <button onClick={onBack} className="nav-link" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                {t('details_back_search')}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '80px' }}>
                {/* Left Column: Media & Info */}
                <div>
                    <div className="glass" style={{ borderRadius: '40px', overflow: 'hidden', position: 'relative', height: '600px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={game.images && game.images[activeImage]} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-primary) 5%, transparent 60%)' }}></div>
                        <div style={{ position: 'absolute', bottom: '50px', left: '50px' }}>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <span className="hero-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: 'white', border: 'none' }}>{game.gameName}</span>
                            </div>
                            <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '10px' }}>{game.title}</h1>
                        </div>
                    </div>

                    {/* Image Gallery Thumbnails */}
                    {game.images && game.images.length > 1 && (
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '60px', overflowX: 'auto', paddingBottom: '10px' }}>
                            {game.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    style={{
                                        width: '120px',
                                        height: '80px',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: `2px solid ${activeImage === idx ? 'var(--accent-primary)' : 'transparent'}`,
                                        opacity: activeImage === idx ? 1 : 0.6,
                                        transition: 'all 0.3s ease',
                                        flexShrink: 0
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginBottom: '60px' }}>
                        <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '30px' }}>{t('details_overview')} <span className="gradient-text">{t('details_account')}</span></h2>
                        <div style={{ fontSize: '1.2rem', whiteSpace: 'pre-line', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                            {game.description || t('details_default_desc')}
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '40px', borderRadius: '30px' }}>
                        <h3 style={{ marginBottom: '30px', fontSize: '1.5rem' }}>{t('details_security_delivery')}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{ color: 'var(--accent-primary)', marginTop: '5px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '8px' }}>{t('details_security_guarantee')}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('details_security_desc')}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{ color: 'var(--accent-primary)', marginTop: '5px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '8px' }}>{t('details_delivery_title')}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('details_delivery_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout & Status */}
                <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '35px', boxShadow: 'var(--shadow-premium)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <span style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{t('details_price')}</span>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>{formatPrice(game.price)}</span>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={() => onAddToCart(game._id)}
                            style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}
                        >
                            {t('details_buy_btn')}
                        </button>
                    </div>

                    <div className="glass" style={{ marginTop: '25px', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            {t('details_secure_badge')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
