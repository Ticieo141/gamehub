import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';

export const GameCard = ({ _id, title, price, gameName, images, onClick }) => (
  <div className="game-card fade-in" onClick={onClick}>
    <img src={images && images[0] && (images[0].startsWith('/') ? `http://localhost:5000${images[0]}` : images[0])} alt={title} className="game-img" />
    <div className="game-info">
      <h3 className="game-title">{title}</h3>
      <div className="game-meta">
        <span className="game-gameName">{gameName}</span>
        <span className="game-price">{formatPrice(price)}</span>
      </div>
    </div>
  </div>
);

const Home = ({ featuredGames, onGameSelect }) => {
  const { t } = useLanguage();
  return (
    <>
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content fade-in">
          <span className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            {t('home_badge')}
          </span>
          <h1 className="hero-title">{t('home_hero_title')} <span className="gradient-text">{t('home_hero_subtitle')}</span></h1>
          <p className="hero-desc">
            {t('home_hero_desc')}
          </p>
          <div className="hero-btns">
            <Link to="/catalog" className="btn-primary">{t('home_hero_btns_explore')}</Link>
            <button className="btn-secondary">{t('home_hero_btns_more')}</button>
          </div>
        </div>
      </header>

      <section className="section" style={{ background: 'rgba(56, 189, 248, 0.02)' }}>
        <div className="section-header">
          <h2 className="section-title">{t('home_why_title')} <span className="gradient-text">GameHub?</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', color: 'var(--accent-primary)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            <h3 style={{ marginBottom: '15px' }}>{t('home_feature_delivery_title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('home_feature_delivery_desc')}</p>
          </div>
          <div className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(129, 140, 248, 0.1)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', color: 'var(--accent-secondary)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 style={{ marginBottom: '15px' }}>{t('home_feature_secure_title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('home_feature_secure_desc')}</p>
          </div>
          <div className="glass" style={{ padding: '40px', borderRadius: '30px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', color: 'var(--accent-primary)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.5 19.5 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 style={{ marginBottom: '15px' }}>{t('home_feature_support_title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('home_feature_support_desc')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{t('home_featured_accounts')} <span className="gradient-text">{t('home_featured_highlight')}</span></h2>
          <Link to="/catalog" className="nav-link">{t('home_view_all')}</Link>
        </div>
        <div className="game-grid">
          {featuredGames.map(game => (
            <GameCard key={game._id} {...game} onClick={() => onGameSelect(game)} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
