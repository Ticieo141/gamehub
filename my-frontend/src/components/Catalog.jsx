import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gameService } from '../api/gameService';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';

const Catalog = ({ onGameSelect }) => {
    const { t } = useLanguage();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get('search') || '';

    const [games, setGames] = useState([]);
    const [allGameNames, setAllGameNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        gameName: '',
        search: initialSearch,
        sort: 'newest'
    });

    useEffect(() => {
        setFilters(prev => ({ ...prev, search: initialSearch }));
    }, [initialSearch]);

    useEffect(() => {
        setLoading(true);
        gameService.getAllGames(filters)
            .then(data => {
                setGames(data);
                // Only update the filter list if we aren't currently filtering by game
                // OR if it's the first load
                if (!filters.gameName || allGameNames.length === 0) {
                    const names = [...new Set(data.map(g => g.gameName))].filter(Boolean);
                    setAllGameNames(names);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching games:", err);
                setLoading(false);
            });
    }, [filters]);

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const resetFilters = () => {
        setFilters({
            gameName: '',
            search: '',
            sort: 'newest'
        });
    };

    const uniqueGameNames = ["", ...allGameNames];

    return (
        <div className="section" style={{ minHeight: '100vh' }}>
            <div className="section-header">
                <div>
                    <h1 className="section-title">{t('catalog_discover')} <span className="gradient-text">{t('catalog_accounts')}</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('catalog_subtitle')}</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                        onClick={resetFilters}
                        className="btn-secondary"
                        style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem' }}
                    >
                        {t('catalog_reset')}
                    </button>
                    <select
                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="glass"
                        style={{ padding: '10px 20px', borderRadius: '12px', color: 'white' }}
                    >
                        <option value="newest">{t('catalog_sort_latest')}</option>
                        <option value="price_low">{t('catalog_sort_price_asc')}</option>
                        <option value="price_high">{t('catalog_sort_price_desc')}</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '50px' }}>
                {/* Filters Sidebar */}
                <aside style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
                    <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                        <div style={{ marginBottom: '35px' }}>
                            <h4 style={{ marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-muted)' }}>{t('catalog_filter_game')}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {uniqueGameNames.map(name => (
                                    <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: filters.gameName === name ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: '0.2s', fontSize: '0.95rem' }}>
                                        <input
                                            type="radio"
                                            name="gameName"
                                            checked={filters.gameName === name}
                                            onChange={() => handleFilterChange('gameName', name)}
                                            style={{ accentColor: 'var(--accent-primary)' }}
                                        /> {name === "" ? t('catalog_filter_all') : name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-muted)' }}>{t('catalog_filter_search')}</h4>
                            <input
                                type="text"
                                placeholder={t('nav_search_placeholder')}
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                style={{ width: '100%', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Game Grid */}
                <div className="game-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px' }}>
                            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('catalog_loading')}</div>
                        </div>
                    ) : games.length > 0 ? (
                        games.map(game => (
                            <div key={game._id} className="game-card fade-in" onClick={() => onGameSelect(game)} style={{ cursor: 'pointer' }}>
                                <img src={game.images && game.images[0]} alt={game.title} className="game-img" />
                                <div className="game-info">
                                    <span className="hero-badge" style={{ padding: '4px 10px', fontSize: '0.7rem', marginBottom: '10px', width: 'fit-content' }}>{game.gameName}</span>
                                    <h3 className="game-title" style={{ fontSize: '1.2rem' }}>{game.title}</h3>
                                    <div className="game-meta">
                                        <span className="game-price" style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>{formatPrice(game.price)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', borderRadius: '30px' }}>
                            <h3 style={{ marginBottom: '15px' }}>{t('orders_empty')}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{t('catalog_adjust_filters')}</p>
                            <button onClick={resetFilters} className="btn-primary" style={{ marginTop: '30px' }}>{t('catalog_clear_filters')}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
