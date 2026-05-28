import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const AdminLayout = ({ children }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>{t('admin_access_denied')}</h2>
                <p>{t('admin_no_permission')}</p>
                <Link to="/" className="btn-primary">{t('admin_back_to_store')}</Link>
            </div>
        );
    }

    const navItems = [
        { name: t('admin_nav_overview'), path: '/admin' },
        { name: t('admin_nav_games'), path: '/admin/games' },
        { name: t('admin_nav_users'), path: '/admin/users' },
        { name: t('admin_nav_orders'), path: '/admin/orders' },
        { name: t('admin_nav_posts'), path: '/admin/posts' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <aside className="glass" style={{ width: '250px', borderRight: '1px solid var(--glass-border)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ marginBottom: '30px', padding: '0 10px', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('admin_sidebar_title')}</h3>
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}></path></svg>
                        {item.name}
                    </NavLink>
                ))}
            </aside>

            {/* Content Area */}
            <main style={{ flex: 1, padding: '40px' }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
