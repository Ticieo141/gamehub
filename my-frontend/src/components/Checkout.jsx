import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../api/orderService';
import { userService } from '../api/userService';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';

const Checkout = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const { items = [], couponCode = null } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [profile, setProfile] = useState(null);
    const [fetchingProfile, setFetchingProfile] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setFetchingProfile(true);
            try {
                const data = await userService.getProfile();
                if (data) {
                    setProfile(data);
                    

                    setBillingInfo({
                        firstName: data.fullName?.split(' ')[0] || '',
                        lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
                        email: data.email || '',
                        address: data.address || '',
                        phone: data.phoneNumber || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching profile for checkout:", err);
            } finally {
                setFetchingProfile(false);
            }
        };

        fetchUserProfile();
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const totalAmount = subtotal; // Removed 10% demo tax for clarity

    const isProfileIncomplete = !billingInfo.address || !billingInfo.phone || !billingInfo.email;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsProcessing(true);

        // Simulate payment processing for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await orderService.createOrder({
                items,
                totalAmount,
                discountAmount: 0, 
                billingInfo,
                paymentMethod,
                couponCode
            });
            setIsProcessing(false);
            setIsSuccess(true);
        } catch (err) {
            setIsProcessing(false);
            setLoading(false);
            alert(t('checkout_error') + ': ' + err.message);
        }
    };

    const getPaymentMethodName = (method) => {
        switch(method) {
            case 'Thẻ tín dụng': return t('checkout_bank_transfer'); // Actually the mapping in original was mapping labels to display
            case 'Credit Card': return t('checkout_bank_transfer'); // Original had 'Credit Card' as internal value
            case 'PayPal': return 'PayPal';
            case 'COD': return 'COD';
            default: return method;
        }
    };

    if (isSuccess) {
        return (
            <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="glass" 
                    style={{ padding: '60px', borderRadius: '40px', textAlign: 'center', maxWidth: '600px' }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}
                    >
                        <CheckCircle size={60} />
                    </motion.div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{t('checkout_success_title')}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
                        {t('checkout_success_desc')}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => navigate('/orders')} style={{ padding: '15px 30px' }}>{t('checkout_btn_view_orders')}</button>
                        <button className="btn-secondary" onClick={() => navigate('/catalog')} style={{ padding: '15px 30px' }}>{t('details_back_store')}</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return (
        <div className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <ShoppingBag size={64} style={{ opacity: 0.3 }} />
            <h2 style={{ color: 'var(--text-muted)' }}>{t('checkout_empty_cart')}</h2>
            <button className="btn-primary" onClick={() => navigate('/catalog')}>{t('home_btn_explore')}</button>
        </div>
    );

    return (
        <div className="section fade-in" style={{ marginTop: '40px', position: 'relative' }}>
            <AnimatePresence>
                {isProcessing && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        style={{ 
                            position: 'fixed', inset: 0, zIndex: 1000, 
                            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px'
                        }}
                    >
                        <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            style={{ width: '60px', height: '60px', border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
                        />
                        <h2 style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1rem' }}>{t('checkout_processing')}</h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <h1 className="section-title" style={{ marginBottom: '50px' }}>{t('checkout_title')} <span className="gradient-text">{t('checkout_subtitle')}</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '60px' }}>
                <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '30px' }}>
                        <h3 style={{ marginBottom: '30px', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                                <Lock size={20} />
                            </div>
                            {t('checkout_contact_info')}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('profile_name')}</label>
                                <input type="text" value={billingInfo.firstName + ' ' + billingInfo.lastName} readOnly style={{ width: '100%', opacity: 0.7 }} />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('profile_phone')}</label>
                                <input type="tel" value={billingInfo.phone} readOnly style={{ width: '100%', opacity: 0.7 }} />
                            </div>
                        </div>
                        <div className="input-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('profile_email')}</label>
                            <input type="email" value={billingInfo.email} readOnly style={{ width: '100%', opacity: 0.7 }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('profile_address')}</label>
                            <input type="text" value={billingInfo.address} readOnly style={{ width: '100%', opacity: 0.7 }} />
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '40px', borderRadius: '30px' }}>
                        <h3 style={{ marginBottom: '30px', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                                <CreditCard size={20} />
                            </div>
                            {t('checkout_payment_method')}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                            {[
                                { id: 'Credit Card', label: t('checkout_bank_transfer') },
                                { id: 'PayPal', label: 'PayPal' },
                                { id: 'COD', label: 'COD' }
                            ].map(method => (
                                <label key={method.id} className="glass-hover" style={{
                                    padding: '20px',
                                    borderRadius: '20px',
                                    border: '1px solid ' + (paymentMethod === method.id ? 'var(--accent-primary)' : 'var(--glass-border)'),
                                    background: paymentMethod === method.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: '0.3s'
                                }}>
                                    <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ accentColor: 'var(--accent-primary)' }} />
                                    <span style={{ fontWeight: '600' }}>{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {isProfileIncomplete && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ 
                                background: 'rgba(231, 76, 60, 0.1)', 
                                border: '1px solid rgba(231, 76, 60, 0.3)', 
                                padding: '25px', 
                                borderRadius: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}
                        >
                            <div style={{ background: '#e74c3c', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Lock size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#e74c3c' }}>{t('checkout_profile_required')}</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {t('checkout_profile_required')}
                                </p>
                            </div>
                            <button 
                                type="button"
                                className="btn-secondary" 
                                onClick={() => navigate('/profile')}
                                style={{ whiteSpace: 'nowrap', borderRadius: '12px' }}
                            >
                                {t('checkout_go_profile')}
                            </button>
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ 
                            padding: '25px', 
                            borderRadius: '20px', 
                            fontSize: '1.2rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px',
                            opacity: loading ? 0.5 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }} 
                        disabled={loading}
                    >
                        {loading ? t('common_processing') || 'Processing...' : <>{t('checkout_btn_pay')} <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '35px' }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>{t('checkout_order_summary')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            {items.map(item => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={item.images[0]} alt="" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                                        <span style={{ color: 'var(--text-muted)', maxWidth: '180px' }}>{item.title}</span>
                                    </div>
                                    <span style={{ fontWeight: '600' }}>{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '800' }}>
                                <span>{t('cart_total')}</span>
                                <span className="gradient-text">{formatPrice(totalAmount)}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '15px', textAlign: 'center' }}>
                                {t('checkout_security_note')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
