import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText, 
    cancelText,
    type = 'danger' // 'danger' or 'warning'
}) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const colors = {
        danger: {
            primary: '#e74c3c',
            bg: 'rgba(231, 76, 60, 0.1)',
            btn: 'linear-gradient(135deg, #e74c3c, #c0392b)'
        },
        warning: {
            primary: '#f1c40f',
            bg: 'rgba(241, 196, 15, 0.1)',
            btn: 'linear-gradient(135deg, #f1c40f, #f39c12)'
        }
    };

    const activeColor = colors[type] || colors.danger;

    return (
        <div style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 9999, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div 
                onClick={onClose}
                style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.85)', 
                    backdropFilter: 'blur(8px)' 
                }}
            ></div>
            
            <div className="glass" style={{ 
                width: '100%', 
                maxWidth: '450px', 
                padding: '35px', 
                borderRadius: '25px', 
                position: 'relative', 
                textAlign: 'center',
                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${activeColor.primary}33`,
                animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                <button 
                    onClick={onClose}
                    style={{ 
                        position: 'absolute', 
                        right: '20px', 
                        top: '20px', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer' 
                    }}
                >
                    <X size={18} />
                </button>

                <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '20px', 
                    background: activeColor.bg, 
                    color: activeColor.primary,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 25px'
                }}>
                    <AlertTriangle size={35} />
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'white' }}>
                    {title || t('common_confirm')}
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '30px' }}>
                    {message || t('admin_games_delete_confirm')}
                </p>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={onClose}
                        style={{ 
                            flex: 1, 
                            padding: '12px', 
                            borderRadius: '12px', 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cancelText || t('details_back_store')}
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{ 
                            flex: 1, 
                            padding: '12px', 
                            borderRadius: '12px', 
                            background: activeColor.btn, 
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: `0 10px 20px ${activeColor.primary}33`,
                            transition: 'all 0.2s'
                        }}
                    >
                        {confirmText || t('cart_remove')}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
