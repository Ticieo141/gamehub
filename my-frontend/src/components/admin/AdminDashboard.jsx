import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../api/adminService';
import { TrendingUp, Users, ShoppingBag, Gamepad2, Clock, Activity, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getStats()
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching admin stats:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="loader"></div>
        </div>
    );

    const statCards = [
        { label: t('admin_dash_revenue'), value: formatPrice(stats?.totalRevenue || 0), color: '#2ecc71', icon: <DollarSign size={24} /> },
        { label: t('admin_dash_orders'), value: stats?.totalOrders || 0, color: '#3498db', icon: <ShoppingBag size={24} /> },
        { label: t('admin_dash_inventory'), value: stats?.totalGames || 0, color: '#9b59b6', icon: <Gamepad2 size={24} /> },
        { label: t('admin_dash_users'), value: stats?.totalUsers || 0, color: '#e67e22', icon: <Users size={24} /> },
    ];

    const maxRevenue = Math.max(...(stats?.revenueData?.map(d => d.amount) || [1]));

    return (
        <div className="fade-in" style={{ paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>{t('admin_dash_title').split(' ')[0]} <span className="gradient-text">{t('admin_dash_title').split(' ').slice(1).join(' ')}</span></h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', boxShadow: '0 0 10px #2ecc71' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>{t('admin_dash_status_online')}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {statCards.map((card, idx) => (
                    <motion.div 
                        key={card.label} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass" 
                        style={{ padding: '30px', borderRadius: '25px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: `${card.color}10`, borderRadius: '50%', filter: 'blur(20px)' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
                            <div style={{ background: `${card.color}20`, color: card.color, padding: '10px', borderRadius: '12px' }}>
                                {card.icon}
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '800' }}>{card.value}</h2>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
                <div className="glass" style={{ padding: '35px', borderRadius: '30px', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{t('admin_dash_analytics_title')}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('admin_dash_analytics_desc')}</p>
                        </div>
                        <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '700' }}>
                            <TrendingUp size={18} /> {t('admin_dash_analytics_compare')}
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '15px', padding: '0 10px 20px' }}>
                        {stats?.revenueData?.map((data, idx) => (
                            <div key={data.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(data.amount / maxRevenue) * 200}px` }}
                                    transition={{ duration: 1, delay: idx * 0.1, ease: "circOut" }}
                                    style={{ 
                                        width: '100%', 
                                        maxWidth: '40px',
                                        background: 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))', 
                                        borderRadius: '8px 8px 4px 4px',
                                        boxShadow: '0 10px 20px rgba(56, 189, 248, 0.2)',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                                        {formatPrice(data.amount)}
                                    </div>
                                </motion.div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{data.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '35px', borderRadius: '30px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                        <Activity size={20} className="gradient-text" />
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t('admin_dash_activity_title')}</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                        {stats?.recentActivity?.length > 0 ? (
                            stats.recentActivity.map((activity, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.05) }}
                                    style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--glass-border)' }}
                                >
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: activity.type === 'Order' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(56, 189, 248, 0.1)', color: activity.type === 'Order' ? '#22c55e' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {activity.type === 'Order' ? <ShoppingBag size={18} /> : <Users size={18} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '2px' }}>{activity.description}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} /> {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {activity.amount && <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#2ecc71' }}>+{formatPrice(activity.amount)}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.3 }}>
                                {t('admin_dash_activity_empty')}
                            </div>
                        )}
                    </div>
                    
                    <button className="btn-secondary" style={{ width: '100%', padding: '12px', marginTop: '20px', fontSize: '0.85rem' }}>{t('admin_dash_btn_logs')}</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
