import React, { useState, useEffect } from 'react';
import { userService } from '../api/userService';
import ImageUpload from './common/ImageUpload';
import { useLanguage } from '../context/LanguageContext';

const Profile = ({ user: initialUser }) => {
    const { t } = useLanguage();
    const [user, setUser] = useState(initialUser || {});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        userService.getProfile()
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching profile:", err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('billing-')) {
            const field = name.replace('billing-', '');
            setUser(prev => ({
                ...prev,
                billingInfo: {
                    ...prev.billingInfo,
                    [field]: value
                }
            }));
        } else {
            setUser(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });
        try {
            const updatedUser = await userService.updateProfile(user);
            setUser(updatedUser);
            setMessage({ type: 'success', text: t('profile_update_success') || 'Profile updated successfully!' });
        } catch (err) {
            console.error("Error updating profile:", err);
            setMessage({ type: 'error', text: t('profile_update_fail') || 'Failed to update profile. Please try again.' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="section" style={{ minHeight: '80vh', textAlign: 'center' }}>
        <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('profile_loading')}</div>
    </div>;

    return (
        <section className="section fade-in" style={{ marginTop: '40px', minHeight: '80vh' }}>
            <div className="section-header">
                <div>
                    <h1 className="section-title">{t('profile_title')} <span className="gradient-text">{t('profile_subtitle')}</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('profile_desc')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: '35px' }}>
                    <h2 style={{ marginBottom: '30px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        {t('profile_info')}
                    </h2>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <div style={{ width: '120px' }}>
                                <ImageUpload
                                    currentImage={user.avatar}
                                    onUploadSuccess={(url) => setUser({ ...user, avatar: url })}
                                    label={t('profile_avatar')}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>{t('profile_full_name')}</label>
                            <input type="text" name="fullName" value={user.fullName || ''} onChange={handleChange} placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="input-group">
                            <label>{t('profile_email')}</label>
                            <input type="email" value={user.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                        </div>
                        <div className="input-group">
                            <label>{t('profile_phone')}</label>
                            <input type="tel" name="phoneNumber" value={user.phoneNumber || ''} onChange={handleChange} placeholder="0123 456 789" />
                        </div>
                        <div className="input-group">
                            <label>{t('profile_address')}</label>
                            <textarea name="address" value={user.address || ''} onChange={handleChange} placeholder="" style={{ minHeight: '100px', resize: 'vertical' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label>{t('profile_gender')}</label>
                                <select name="gender" value={user.gender || 'Prefer not to say'} onChange={handleChange} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}>
                                    <option value="Male">{t('profile_gender_male')}</option>
                                    <option value="Female">{t('profile_gender_female')}</option>
                                    <option value="Other">{t('profile_gender_other')}</option>
                                    <option value="Prefer not to say">{t('profile_gender_hidden')}</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>{t('profile_dob')}</label>
                                <input type="date" name="dob" value={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '35px' }}>
                        <h2 style={{ marginBottom: '30px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '10px', borderRadius: '12px', color: '#2ecc71' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            </div>
                            {t('profile_billing')}
                        </h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div className="input-group">
                                <label>{t('profile_card_number')}</label>
                                <input type="text" name="billing-cardNumber" value={user.billingInfo?.cardNumber || ''} onChange={handleChange} placeholder="**** **** **** 1234" />
                            </div>
                            <div className="input-group">
                                <label>{t('profile_card_expiry')}</label>
                                <input type="text" name="billing-expiry" value={user.billingInfo?.cardExpiry || ''} onChange={handleChange} placeholder="MM/YY" />
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '40px', borderRadius: '35px' }}>
                        {message.text && (
                            <div style={{
                                padding: '15px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                background: message.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                color: message.type === 'success' ? '#2ecc71' : '#e74c3c',
                                border: `1px solid ${message.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}`,
                                textAlign: 'center',
                                fontWeight: '600'
                            }}>
                                {message.text}
                            </div>
                        )}
                        <button type="submit" disabled={updating} className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>
                            {updating ? t('profile_updating') : t('profile_save')}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default Profile;
