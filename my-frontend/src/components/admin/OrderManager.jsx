import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../api/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { Search, ChevronUp, ChevronDown, Eye, Filter, Calendar, User, X } from 'lucide-react';

const OrderManager = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Search and Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        adminService.getOrders()
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await adminService.updateOrderStatus(id, newStatus);
            fetchOrders();
        } catch (err) {
            alert(t('error_general') + ': ' + err.message);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Filter and Sort Logic
    const filteredAndSortedOrders = useMemo(() => {
        let result = [...orders];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order => 
                order._id.toLowerCase().includes(query) || 
                order.user?.username.toLowerCase().includes(query) ||
                order.user?.email.toLowerCase().includes(query) ||
                order.billingInfo?.firstName?.toLowerCase().includes(query) ||
                order.billingInfo?.lastName?.toLowerCase().includes(query)
            );
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'customer') {
                    aValue = a.user?.username || '';
                    bValue = b.user?.username || '';
                } else {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [orders, searchQuery, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>{t('common_loading')}...</div>;

    const getStatusLabel = (status) => {
        switch(status) {
            case 'Completed': return t('order_status_completed');
            case 'Pending': return t('order_status_pending');
            case 'Processing': return t('order_status_processing');
            case 'Cancelled': return t('order_status_cancelled');
            default: return status;
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>{t('admin_orders_title')}</h1>

                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: '350px' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo Mã đơn, Khách hàng, Email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px 15px 12px 45px', 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid var(--glass-border)', 
                            borderRadius: '12px', 
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('_id')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_orders_id')} {getSortIcon('_id')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('customer')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_orders_customer')} {getSortIcon('customer')}
                                </div>
                            </th>
                            <th style={{ padding: '20px' }}>{t('cart_items')}</th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('totalAmount')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_orders_total')} {getSortIcon('totalAmount')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('status')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_orders_status')} {getSortIcon('status')}
                                </div>
                            </th>
                            <th style={{ padding: '20px' }}>{t('admin_orders_actions')}</th>
                            <th style={{ padding: '20px' }}>Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Không có đơn hàng nào phù hợp.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedOrders.map(o => (
                                <tr key={o._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{o._id.slice(-8).toUpperCase()}</td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '500' }}>{o.user?.username || t('community_anonymous')}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.user?.email}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', fontSize: '0.9rem' }}>
                                        {o.items.length} {t('cart_items')}
                                    </td>
                                    <td style={{ padding: '20px', fontWeight: 'bold' }}>{formatPrice(o.totalAmount)}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            background: o.status === 'Completed' ? 'rgba(46, 204, 113, 0.2)' : 
                                                        o.status === 'Cancelled' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                                            color: o.status === 'Completed' ? '#2ecc71' : 
                                                   o.status === 'Cancelled' ? '#e74c3c' : '#f1c40f',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            {getStatusLabel(o.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <button
                                            onClick={() => handleViewDetails(o)}
                                            style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <Eye size={16} /> Chi tiết
                                        </button>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                                            style={{ background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--glass-border)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', outline: 'none' }}
                                        >
                                            <option value="Pending">{t('order_status_pending')}</option>
                                            <option value="Processing">{t('order_status_processing')}</option>
                                            <option value="Completed">{t('order_status_completed')}</option>
                                            <option value="Cancelled">{t('order_status_cancelled')}</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Post Detail Modal */}
            {showModal && selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px', backdropFilter: 'blur(10px)' }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '800px', padding: '40px', borderRadius: '30px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{t('admin_order_detail_title')}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>ID: {selectedOrder._id} • {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div>
                                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={18} /> {t('admin_customer_info')}
                                    </h4>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                        <DetailItem label={t('auth_username')} value={selectedOrder.user?.username} />
                                        <DetailItem label={t('profile_name')} value={selectedOrder.user?.fullName} />
                                        <DetailItem label={t('profile_email')} value={selectedOrder.user?.email} />
                                        <DetailItem label={t('profile_phone')} value={selectedOrder.user?.phoneNumber} />
                                        <DetailItem label={t('profile_address')} value={selectedOrder.user?.address} isLongText />
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div>
                                    <h4 style={{ color: '#2ecc71', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Filter size={18} /> {t('checkout_order_summary')}
                                    </h4>
                                    <div style={{ background: 'rgba(46, 204, 113, 0.05)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.1)' }}>
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>{item.title}</span>
                                                <span style={{ fontWeight: 'bold' }}>{formatPrice(item.price)}</span>
                                            </div>
                                        ))}
                                        {selectedOrder.discountAmount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '12px', color: '#e74c3c' }}>
                                                <span>{t('checkout_discount')}</span>
                                                <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                                            </div>
                                        )}
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            <span>{t('cart_total')}</span>
                                            <span style={{ color: 'var(--accent-secondary)' }}>{formatPrice(selectedOrder.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '12px 40px', borderRadius: '15px' }}>{t('details_back_store')}</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                tbody tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
            `}</style>
        </div>
    );
};

const DetailItem = ({ label, value, isLongText = false }) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
            <div style={{ 
                fontSize: '0.95rem', 
                color: 'white', 
                padding: isLongText ? '12px' : '0',
                background: isLongText ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderRadius: '10px',
                wordBreak: 'break-word',
                border: isLongText ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
                {value || '---'}
            </div>
        </div>
    );
};

export default OrderManager;
