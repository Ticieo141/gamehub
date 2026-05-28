import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.register(formData);
            setIsRegistered(true);
        } catch (err) {
            setError(err.message || t('auth_error_register'));
        }
    };

    if (isRegistered) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="glass fade-in" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--accent-primary)' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <h2 className="section-title" style={{ marginBottom: '15px' }}>Đăng ký <span className="gradient-text">Thành công!</span></h2>
                    <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '15px' }}>Một email xác nhận đã được gửi đến: <br/><strong style={{ color: 'var(--accent-primary)' }}>{formData.email}</strong></p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Vui lòng kiểm tra hộp thư đến (hoặc thư rác) và nhấn vào link để kích hoạt tài khoản của bạn.</p>
                    <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '12px 30px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>Quay lại đăng nhập</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass fade-in" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>{t('auth_register_title')} <span className="gradient-text">{t('auth_register_subtitle')}</span></h2>
                {error && <p style={{ color: '#ff4444', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('auth_username')}</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
                            placeholder="johndoe"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('auth_email')}</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('auth_password')}</label>
                        <input
                            type="password"
                            required
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>{t('auth_btn_register')}</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {t('auth_have_account')} <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{t('auth_btn_login')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
