import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { couponService } from '../api/couponService';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';

const Cart = ({ items, onRemove, onClose }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tax = 0; // Removed demo tax
    const total = subtotal - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplying(true);
        setCouponError('');
        try {
            const data = await couponService.validateCoupon(couponCode);
            if (data.discountType === 'percentage') {
                setDiscount((subtotal * data.discountValue) / 100);
            } else {
                setDiscount(data.discountValue);
            }
        } catch (err) {
            setCouponError(err.message || 'Invalid coupon code');
            setDiscount(0);
        } finally {
            setIsApplying(false);
        }
    };

    const handleCheckoutClick = () => {
        onClose();
        navigate('/checkout', { state: { items, couponCode: discount > 0 ? couponCode : null } });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
            <div className="fade-in" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }} onClick={onClose}></div>
            <div className="glass fade-in" style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '100%', padding: '40px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--glass-border)', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem' }}>{t('cart_title')} <span className="gradient-text">{t('cart_your')}</span></h2>
                    <button onClick={onClose} style={{ padding: '10px', color: 'var(--text-muted)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '30px', paddingRight: '10px' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <div style={{ opacity: 0.2, marginBottom: '20px' }}>
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>{t('cart_empty')}.</p>
                            <button className="btn-primary" style={{ marginTop: '30px' }} onClick={onClose}>{t('cart_start_shopping')}</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {items.map(item => (
                                <div key={item._id} className="glass" style={{ padding: '15px', borderRadius: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <img src={item.images[0]} alt="" style={{ width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: '5px' }}>{item.title}</h4>
                                        <div style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{formatPrice(item.price)}</div>
                                    </div>
                                    <button onClick={() => onRemove(item._id)} style={{ padding: '8px', color: '#e74c3c' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
                        <div style={{ marginBottom: '25px' }}>

                            {couponError && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '8px' }}>{t('cart_coupon_invalid')}</p>}
                            {discount > 0 && <p style={{ color: '#2ecc71', fontSize: '0.8rem', marginTop: '8px' }}>{t('cart_coupon_success')}</p>}
                        </div>


                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button className="btn-secondary" style={{ width: '100%', padding: '15px' }} onClick={() => { onClose(); navigate('/cart'); }}>
                                {t('nav_catalog')} - {t('cart_title')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
