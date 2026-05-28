import React, { useState, useEffect } from 'react';
import { supportService } from '../api/supportService';
import { useLanguage } from '../context/LanguageContext';

const Support = () => {
    const { t } = useLanguage();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', category: 'Orders & Billing' });
    const token = localStorage.getItem('token');

    const faqs = [
        { q: t('support_faq_1_q'), a: t('support_faq_1_a') },
        { q: t('support_faq_2_q'), a: t('support_faq_2_a') },
        { q: t('support_faq_3_q'), a: t('support_faq_3_a') },
        { q: t('support_faq_4_q'), a: t('support_faq_4_a') }
    ];

    const fetchTickets = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await supportService.getUserTickets();
            setTickets(data);
        } catch (err) {
            console.error("Error fetching tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return alert(t('support_login_alert'));

        try {
            await supportService.submitTicket(formData);
            setShowModal(false);
            setFormData({ subject: '', description: '', category: 'Orders & Billing' });
            fetchTickets();
            alert(t('support_success_alert'));
        } catch (err) {
            console.error("Error submitting ticket:", err.message);
        }
    };

    return (
        <section className="section" style={{ minHeight: '80vh' }}>
            <div className="section-header" style={{ textAlign: 'center', display: 'block', marginBottom: '60px' }}>
                <h2 className="section-title">{t('support_desc')}</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '15px auto 0' }}>{t('support_desc_detail')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                <div className="glass" style={{ padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📦</div>
                    <h4>{t('support_cat_billing')}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('support_cat_billing_desc')}</p>
                </div>
                <div className="glass" style={{ padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎮</div>
                    <h4>{t('support_cat_technical')}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('support_cat_technical_desc')}</p>
                </div>
                <div className="glass" style={{ padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🛡️</div>
                    <h4>{t('support_cat_security')}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('support_cat_security_desc')}</p>
                </div>
            </div>

            {token && tickets.length > 0 && (
                <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginBottom: '80px' }}>
                    <h3 style={{ marginBottom: '30px' }}>{t('support_tickets_title')} <span className="gradient-text">{t('support_tickets_subtitle')}</span></h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {tickets.map(ticket => (
                            <div key={ticket._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <div style={{ fontWeight: '700' }}>{ticket.subject}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {ticket.category === 'Orders & Billing' ? t('support_cat_billing') : ticket.category === 'Technical Support' ? t('support_cat_technical') : t('support_cat_security')} • {new Date(ticket.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ background: ticket.status === 'Open' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.1)', color: ticket.status === 'Open' ? '#44ff44' : 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>
                                    {ticket.status === 'Open' ? t('support_status_open') : t('support_status_closed')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="glass" style={{ padding: '50px', borderRadius: '24px' }}>
                <h3 style={{ marginBottom: '40px', textAlign: 'center' }}>{t('support_faq_title')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                    {faqs.map((faq, i) => (
                        <div key={i}>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>{faq.q}</h4>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                <h3>{t('support_need_help')}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>{t('support_need_help_desc')}</p>
                <button className="btn-primary" style={{ padding: '15px 40px' }} onClick={() => setShowModal(true)}>{t('support_btn_contact')}</button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div onClick={() => setShowModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}></div>
                    <div className="glass fade-in" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <h2 className="section-title" style={{ marginBottom: '30px' }}>{t('support_title')} <span className="gradient-text">{t('support_subtitle')}</span></h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('support_ticket_subject')}</label>
                                <input
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
                                    placeholder={t('support_ticket_placeholder_subject')}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('support_ticket_category')}</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white' }}
                                >
                                    <option value="Orders & Billing">{t('support_cat_billing')}</option>
                                    <option value="Technical Support">{t('support_cat_technical')}</option>
                                    <option value="Account Safety">{t('support_cat_security')}</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('support_ticket_desc')}</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'white', resize: 'none' }}
                                    placeholder={t('support_ticket_placeholder_desc')}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>{t('support_btn_submit')}</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '12px' }}>{t('profile_cancel')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Support;
