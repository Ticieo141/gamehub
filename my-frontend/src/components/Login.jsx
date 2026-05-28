import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../api/authService';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ onLoginSuccess }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showResend, setShowResend] = useState(false);
    const [resendStatus, setResendStatus] = useState(''); // '', 'loading', 'success', 'error'
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowResend(false);
        try {
            const data = await authService.login(formData);
            localStorage.setItem('token', data.token);
            onLoginSuccess(data.token);
            navigate('/');
        } catch (err) {
            setError(err.message || t('auth_error_login'));
            if (err.requiresVerification) {
                setShowResend(true);
            }
        }
    };

    const handleResend = async () => {
        setResendStatus('loading');
        try {
            const data = await authService.resendVerification(formData.email);
            setResendStatus('success');
            setError(data.message);
        } catch (err) {
            setResendStatus('error');
            setError(err.message || 'Không thể gửi lại email. Thử lại sau.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const data = await authService.googleLogin(credentialResponse.credential);
            localStorage.setItem('token', data.token);
            onLoginSuccess(data.token);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Lỗi đăng nhập bằng Google');
        }
    };

    const handleGoogleError = () => {
        setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass fade-in" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>{t('auth_login_title')} <span className="gradient-text">{t('auth_login_subtitle')}</span></h2>
                {error && <p style={{ color: '#ff4444', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
                {showResend && (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button 
                            onClick={handleResend}
                            disabled={resendStatus === 'loading'}
                            style={{ 
                                background: 'rgba(56, 189, 248, 0.1)', 
                                border: '1px solid var(--accent-primary)', 
                                color: 'var(--accent-primary)', 
                                padding: '8px 16px', 
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {resendStatus === 'loading' ? 'Đang gửi...' : 'Gửi lại email xác nhận'}
                        </button>
                        {resendStatus === 'success' && <p style={{ color: '#2ecc71', fontSize: '0.8rem', marginTop: '10px' }}>Kiểm tra hộp thư của bạn!</p>}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>{t('auth_btn_login')}</button>
                </form>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
                    <span style={{ padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                    />
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {t('auth_no_account')} <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{t('auth_btn_register')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
