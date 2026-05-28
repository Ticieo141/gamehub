import React, { useState, useEffect } from 'react';
import { orderService } from '../api/orderService';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';

const CredentialCard = ({ acc }) => {
    const { t } = useLanguage();
    const [revealed, setRevealed] = useState(false);
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '30px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '15px', right: '20px' }}>
                <button
                    onClick={() => setRevealed(!revealed)}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: revealed ? 'var(--accent-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    {revealed ? t('common_hide') || 'Hide' : t('common_show') || 'Show'}
                </button>
            </div>
            <div style={{ fontWeight: '800', marginBottom: '20px', color: 'white', fontSize: '1.1rem' }}>{acc.title}</div>
            <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{t('common_username') || 'Username'}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>{revealed ? acc.username : '••••••••••••'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{t('common_password') || 'Password'}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>{revealed ? acc.password : '••••••••••••'}</div>
                </div>
            </div>
        </div>
    );
};

const Orders = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        orderService.getUserOrders()
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="section" style={{ minHeight: '80vh', textAlign: 'center' }}>
        <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('orders_loading') || 'Loading orders...'}</div>
    </div>;

    return (
        <section className="section" style={{ minHeight: '80vh' }}>
            <div className="section-header">
                <div>
                    <h1 className="section-title">{t('orders_title')} <span className="gradient-text">{t('orders_subtitle') || 'History'}</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('orders_desc') || 'A secure record of your transactions'}</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="glass" style={{ padding: '80px', textAlign: 'center', borderRadius: '40px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </div>
                    <h2 style={{ marginBottom: '15px' }}>{t('orders_empty')}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>{t('orders_empty_desc') || 'Your purchased accounts will appear here.'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {orders.map(order => (
                        <div key={order._id} className="glass fade-in" style={{ padding: '40px', borderRadius: '35px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', paddingBottom: '25px', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{t('orders_id')}</div>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{t('orders_date')}</div>
                                    <div style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{t('orders_total')}</div>
                                    <div className="gradient-text" style={{ fontWeight: '800', fontSize: '1.3rem' }}>{formatPrice(order.totalAmount)}</div>
                                </div>
                                <div>
                                    <span style={{
                                        padding: '8px 20px',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        background: order.status === 'Completed' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                        color: order.status === 'Completed' ? '#2ecc71' : 'var(--accent-primary)',
                                        border: order.status === 'Completed' ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)'
                                    }}>
                                        {order.status === 'Completed' ? t('status_completed') || 'COMPLETED' : order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {order.deliveredAccounts && order.deliveredAccounts.length > 0 && (
                                <div style={{ marginBottom: '40px' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-primary)' }}>
                                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </div>
                                        {t('orders_account_info')}
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {order.deliveredAccounts.map((acc, idx) => (
                                            <CredentialCard key={idx} acc={acc} />
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: '#e74c3c', fontSize: '0.9rem', fontWeight: '500' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                        {t('orders_security_note') || 'Security Note: Change credentials after first login.'}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('orders_items')}</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                            <img src={item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000'} alt="" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>{item.title}</div>
                                                <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '600' }}>{formatPrice(item.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Orders;
