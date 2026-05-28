import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="section" style={{ padding: '5%', borderTop: '1px solid var(--glass-border)', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
        <div>
          <div className="logo" style={{ marginBottom: '20px' }}>
            <span className="gradient-text">GAME</span>HUB
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
            Thị trường hàng đầu thế giới về khóa game và tài khoản kỹ thuật số.
          </p>
        </div>
        <div className="nav-links" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4 style={{ marginBottom: '5px' }}>Hỗ trợ</h4>
          <Link to="/support" className="nav-link">Trung tâm Trợ giúp</Link>
          <Link to="/support" className="nav-link">Liên hệ Hỗ trợ</Link>
          <Link to="/support" className="nav-link">Câu hỏi thường gặp</Link>
        </div>
      </div>
      <div style={{ marginTop: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2026 GameHub Marketplace. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
};

export default Footer;
