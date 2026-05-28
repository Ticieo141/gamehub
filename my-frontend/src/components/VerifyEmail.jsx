import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../api/authService';
import { useLanguage } from '../context/LanguageContext';

const VerifyEmail = () => {
    const { token } = useParams();
    const { t } = useLanguage();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const data = await authService.verifyEmail(token);
                setStatus('success');
                setMessage(data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Xác nhận thất bại. Link có thể đã hết hạn.');
            }
        };
        verify();
    }, [token]);

    const containerStyle = {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const cardStyle = {
        maxWidth: '500px',
        width: '100%',
        padding: '40px',
        textAlign: 'center',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    if (status === 'loading') {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div className="spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px', border: '3px solid rgba(56, 189, 248, 0.1)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <h2 style={{ color: 'white', marginBottom: '10px' }}>Đang xác nhận tài khoản...</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Vui lòng đợi trong giây lát.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: status === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 25px',
                    color: status === 'success' ? '#2ecc71' : '#e74c3c'
                }}>
                    {status === 'success' ? (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    )}
                </div>

                <h2 style={{ color: 'white', marginBottom: '15px', fontSize: '1.8rem' }}>
                    {status === 'success' ? 'Xác nhận thành công!' : 'Xác nhận thất bại'}
                </h2>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>
                    {message}
                </p>

                <Link 
                    to="/" 
                    className="btn-primary" 
                    style={{ 
                        display: 'inline-block', 
                        padding: '12px 30px', 
                        borderRadius: '12px', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {status === 'success' ? 'Về trang chủ để đăng nhập' : 'Quay lại trang chủ'}
                </Link>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            ` }} />
        </div>
    );
};

export default VerifyEmail;
