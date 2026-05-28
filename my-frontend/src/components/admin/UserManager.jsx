import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../api/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { Search, ChevronUp, ChevronDown, User, Mail, Shield, Calendar, Eye, X } from 'lucide-react';

const UserManager = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Search and Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        adminService.getUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setLoading(false);
            });
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const roleText = newRole === 'admin' ? t('admin_users_role_admin') : t('admin_users_role_user');
        if (window.confirm(`${t('admin_users_confirm_role')}${roleText}?`)) {
            try {
                await adminService.updateUserRole(id, newRole);
                fetchUsers();
            } catch (err) {
                alert(t('admin_users_error_role') + ': ' + err.message);
            }
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Filter and Sort Logic
    const filteredAndSortedUsers = useMemo(() => {
        let result = [...users];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user => 
                user.username.toLowerCase().includes(query) || 
                user.email.toLowerCase().includes(query) ||
                user.fullName?.toLowerCase().includes(query)
            );
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [users, searchQuery, sortConfig]);

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

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>
                    {t('admin_nav_users').split(' ')[0]} <span className="gradient-text">{t('admin_nav_users').split(' ').slice(1).join(' ')}</span>
                </h1>

                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo Tên, Email..." 
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
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('username')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_users_col_username')} {getSortIcon('username')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('email')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('profile_email')} {getSortIcon('email')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('role')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_users_col_role')} {getSortIcon('role')}
                                </div>
                            </th>
                            <th style={{ padding: '20px', cursor: 'pointer' }} onClick={() => requestSort('createdAt')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('admin_users_col_joined')} {getSortIcon('createdAt')}
                                </div>
                            </th>
                            <th style={{ padding: '20px' }}>{t('admin_orders_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Không tìm thấy người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedUsers.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                {u.avatar ? <img src={u.avatar.startsWith('/') ? `http://localhost:5000${u.avatar}` : u.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : u.username[0].toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{u.username}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-secondary)' }}>{u.email}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            background: u.role === 'admin' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            color: u.role === 'admin' ? '#2ecc71' : 'var(--text-secondary)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <Shield size={12} /> {u.role === 'admin' ? t('admin_users_role_admin') : t('admin_users_role_user')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button
                                                onClick={() => handleViewDetails(u)}
                                                style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <Eye size={16} /> Chi tiết
                                            </button>
                                            <button
                                                onClick={() => handleRoleUpdate(u._id, u.role)}
                                                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                                            >
                                                {t('admin_users_btn_change_role')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px', backdropFilter: 'blur(10px)' }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '700px', padding: '40px', borderRadius: '30px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', overflow: 'hidden', border: '3px solid var(--accent-primary)' }}>
                                {selectedUser.avatar ? <img src={selectedUser.avatar.startsWith('/') ? `http://localhost:5000${selectedUser.avatar}` : selectedUser.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : selectedUser.username[0].toUpperCase()}
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedUser.username}</h2>
                            <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>{selectedUser.email}</p>
                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{selectedUser.role === 'admin' ? t('admin_users_role_admin').toUpperCase() : t('admin_users_role_user').toUpperCase()}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '25px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {t('admin_users_personal_info')}</h4>
                                <DetailItem label={t('profile_name')} value={selectedUser.fullName} />
                                <DetailItem label={t('profile_phone')} value={selectedUser.phoneNumber} />
                                <DetailItem label={t('profile_gender')} value={selectedUser.gender} />
                                <DetailItem label={t('profile_dob')} value={selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : null} />
                                <DetailItem label={t('profile_address')} value={selectedUser.address} isLongText />
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '25px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ color: '#2ecc71', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} /> {t('admin_users_billing_info')}</h4>
                                <DetailItem label={t('profile_card_number')} value={selectedUser.billingInfo?.cardNumber} isMasked />
                                <DetailItem label={t('profile_expiry')} value={selectedUser.billingInfo?.cardExpiry} />
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                                    <h4 style={{ color: '#e67e22', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Hệ thống</h4>
                                    <DetailItem label={t('admin_users_col_joined')} value={new Date(selectedUser.createdAt).toLocaleString()} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '10px 40px', borderRadius: '12px' }}>{t('details_back_store')}</button>
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

const DetailItem = ({ label, value, isLongText = false, isMasked = false }) => {
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
                fontFamily: isMasked ? 'monospace' : 'inherit',
                border: isLongText ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
                {value || '---'}
            </div>
        </div>
    );
};

export default UserManager;
