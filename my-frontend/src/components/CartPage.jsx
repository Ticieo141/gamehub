import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatPrice';
import { couponService } from '../api/couponService';

const CartPage = ({ items, onRemove }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    // Sync selected items if items change (e.g., item removed)
    useEffect(() => {
        setSelectedIds(prev => prev.filter(id => items.some(item => item._id === id)));
    }, [items]);

    const handleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(item => item._id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(i => i !== id) 
                : [...prev, id]
        );
    };

    const selectedItems = items.filter(item => selectedIds.includes(item._id));
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
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
            setCouponError(err.message || t('cart_coupon_invalid'));
            setDiscount(0);
        } finally {
            setIsApplying(false);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        navigate('/checkout', { 
            state: { 
                items: selectedItems, 
                couponCode: discount > 0 ? couponCode : null 
            } 
        });
    };

    if (items.length === 0) {
        return (
            <div className="section" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <ShoppingBag size={64} style={{ opacity: 0.3 }} />
                </div>
                <h2 style={{ fontSize: '2rem' }}>{t('cart_empty')}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{t('cart_empty_desc')}</p>
                <button className="btn-primary" onClick={() => navigate('/catalog')} style={{ padding: '15px 40px' }}>{t('cart_start_shopping')}</button>
            </div>
        );
    }

    return (
        <div className="section fade-in" style={{ paddingBottom: '100px' }}>
            <h1 className="section-title" style={{ marginBottom: '50px' }}>
                {t('cart_page_title').split(' ')[0]} <span className="gradient-text">{t('cart_page_title').split(' ').slice(1).join(' ')}</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {/* Header Row */}
                    <div className="glass" style={{ padding: '20px 30px', borderRadius: '20px', display: 'grid', gridTemplateColumns: '50px 1fr 150px 150px 80px', alignItems: 'center', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="checkbox" 
                                checked={selectedIds.length === items.length && items.length > 0} 
                                onChange={handleSelectAll}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                            />
                        </div>
                        <div>{t('catalog_accounts') || 'Product'}</div>
                        <div style={{ textAlign: 'center' }}>{t('cart_item_unit_price')}</div>
                        <div style={{ textAlign: 'center' }}>{t('cart_item_total_price')}</div>
                        <div style={{ textAlign: 'center' }}>{t('nav_search_placeholder').split(' ')[0]}</div>
                    </div>

                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <AnimatePresence mode="popLayout">
                            {items.map(item => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={item._id} 
                                    className="glass-hover"
                                    style={{ 
                                        padding: '25px 30px', 
                                        borderRadius: '25px', 
                                        display: 'grid', 
                                        gridTemplateColumns: '50px 1fr 150px 150px 80px', 
                                        alignItems: 'center',
                                        background: selectedIds.includes(item._id) ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255,255,255,0.02)',
                                        border: selectedIds.includes(item._id) ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid var(--glass-border)',
                                        transition: '0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(item._id)} 
                                            onChange={() => toggleSelect(item._id)}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <img src={item.images[0]} alt="" style={{ width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover' }} />
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{item.title}</h4>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.gameName}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', fontWeight: '500' }}>{formatPrice(item.price)}</div>
                                    <div style={{ textAlign: 'center', fontWeight: '700', color: 'var(--accent-primary)' }}>{formatPrice(item.price)}</div>
                                    <div style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={() => onRemove(item._id)} 
                                            style={{ padding: '10px', color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)', borderRadius: '12px', transition: '0.3s' }}
                                            className="btn-hover-scale"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div style={{ position: 'sticky', top: '120px' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '35px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>{t('cart_summary')}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>{t('cart_subtotal')} ({selectedIds.length} {t('cart_items_count')})</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder={t('cart_coupon_placeholder')}
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '0 20px', borderRadius: '12px' }}
                                        onClick={handleApplyCoupon}
                                        disabled={isApplying || subtotal === 0}
                                    >
                                        {isApplying ? '...' : t('cart_coupon_apply')}
                                    </button>
                                </div>
                                {couponError && <p style={{ color: '#e74c3c', fontSize: '0.75rem' }}>{couponError}</p>}
                            </div>

                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71', fontWeight: '600' }}>
                                    <span>{t('cart_discount')}</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px dashed var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: '600' }}>{t('cart_total')}</span>
                                <span className="gradient-text" style={{ fontSize: '2rem', fontWeight: '900' }}>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button 
                            className="btn-primary" 
                            style={{ 
                                padding: '20px', 
                                borderRadius: '20px', 
                                fontSize: '1.2rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '12px',
                                opacity: selectedIds.length === 0 ? 0.5 : 1,
                                cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer'
                            }}
                            onClick={handleCheckout}
                            disabled={selectedIds.length === 0}
                        >
                            {t('cart_proceed_checkout')} <ArrowRight size={20} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <Check size={16} color="#2ecc71" />
                            <span>100% {t('checkout_security_note')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
