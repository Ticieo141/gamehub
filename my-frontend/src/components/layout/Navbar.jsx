import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = ({ scrolled, isHomePage, location, searchTerm, onSearchChange, onSearchKeyDown, user, cartItemsCount, onCartToggle, onLogout, onLoginClick }) => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${scrolled || !isHomePage ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <span className="gradient-text">GAME</span>HUB
      </Link>

      <div className="nav-links">
        <Link to="/catalog" className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`}>{t('nav_catalog')}</Link>
        <Link to="/community" className={`nav-link ${location.pathname === '/community' ? 'active' : ''}`}>{t('nav_community')}</Link>
        <Link to="/support" className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}>{t('nav_support')}</Link>
      </div>

      <div className="nav-actions">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder={t('nav_search_placeholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
        </div>

        <button className="nav-btn" onClick={() => onCartToggle(true)} style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          {cartItemsCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{cartItemsCount}</span>}
        </button>

        <div className="dropdown" ref={dropdownRef}>
          <button className="nav-link" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
            {user ? (
              user.avatar ? (
                <img 
                  src={user.avatar.startsWith('/') ? `http://localhost:5000${user.avatar}` : user.avatar} 
                  alt="Avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' }} 
                />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: '700', fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(56, 189, 248, 0.3)' }}>
                  {user.fullName ? user.fullName[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>
              )
            ) : (
              <div className="glass" style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }}><path d="m6 9 6 6 6-6" /></svg>
          </button>

          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            {user ? (
              <>
                <div className="dropdown-header">
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white' }}>{user.fullName || user.username}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  {t('nav_profile')}
                </Link>
                <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  {t('nav_orders')}
                </Link>
                <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  {t('cart_page_title')}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)} style={{ color: 'var(--accent-primary)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    {t('nav_admin')}
                  </Link>
                )}
              </>
            ) : (
              <button className="dropdown-item" onClick={() => { onLoginClick(); setDropdownOpen(false); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                {t('nav_login')}
              </button>
            )}

            <div className="dropdown-divider"></div>
            <div className="dropdown-section-title">{t('common_language')}</div>
            <div className="dropdown-lang-toggle">
              <button className={lang === 'vi' ? 'active' : ''} onClick={() => { setLang('vi'); setDropdownOpen(false); }}>VI</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => { setLang('en'); setDropdownOpen(false); }}>EN</button>
            </div>

            {user && (
              <>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { onLogout(); setDropdownOpen(false); }} style={{ width: '100%', color: '#ef4444' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  {t('nav_logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
