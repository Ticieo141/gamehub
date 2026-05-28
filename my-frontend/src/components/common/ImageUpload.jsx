import React, { useState } from 'react';

const ImageUpload = ({ 
    onUploadSuccess, 
    onUploadStart,
    onUploadEnd,
    currentImage, 
    label = "Tải ảnh lên", 
    folder = "uploads", 
    multiple = false,
    style = {},
    showPreview = true,
    children
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || null);
    const [fileCount, setFileCount] = useState(0);

    // Sync preview with currentImage prop
    React.useEffect(() => {
        if (currentImage) {
            setPreview(currentImage);
        }
    }, [currentImage]);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setFileCount(files.length);

        // Show first file as preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(files[0]);

        setUploading(true);
        if (onUploadStart) onUploadStart();
        const formData = new FormData();
        const token = localStorage.getItem('token');

        try {
            let data;
            const uploadUrl = 'http://localhost:5000/api/upload';
            
            if (multiple) {
                // For multiple, we always use /multiple even if 1 file is selected
                files.forEach(file => formData.append('files', file));
                const response = await fetch(`${uploadUrl}/multiple`, {
                    method: 'POST',
                    body: formData,
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                data = await response.json();
                if (data.success) {
                    onUploadSuccess(data.files.map(f => f.url));
                }
            } else {
                formData.append('file', files[0]);
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                data = await response.json();
                if (data.success) {
                    onUploadSuccess(data.url);
                }
            }
            
            if (!data.success) {
                alert('Tải lên thất bại: ' + (data.message || 'Lỗi không xác định'));
            }
        } catch (err) {
            console.error("Upload error details:", err);
            alert(`Lỗi kết nối máy chủ (${err.message}). Vui lòng kiểm tra backend.`);
        } finally {
            setUploading(false);
            if (onUploadEnd) onUploadEnd();
        }
    };

    // Helper to get full image URL
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('data:')) return url;
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    return (
        <div className="image-upload-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
            {label && !children && <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{label}</label>}
            <div style={{ 
                position: 'relative', 
                width: children ? '100%' : '100%', 
                height: children ? '100%' : '100px', 
                background: children ? 'transparent' : 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                border: children ? 'none' : '1px dashed var(--glass-border)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}>
                {children ? children : (
                    showPreview && preview ? (
                        <>
                            <img src={getImageUrl(preview)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                            {multiple && fileCount > 1 && (
                                <div style={{ position: 'absolute', background: 'var(--accent-primary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    +{fileCount - 1} {fileCount > 2 ? 'ảnh khác' : 'ảnh khác'}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '10px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px', opacity: 0.5 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <p style={{ fontSize: '0.65rem' }}>{multiple ? 'Tải lên nhiều ảnh' : 'Kéo thả hoặc click'}</p>
                        </div>
                    )
                )}
                
                <input 
                    type="file" 
                    multiple={multiple}
                    onChange={handleFileChange} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                    accept="image/*"
                    title={label}
                />

                {uploading && (
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        background: 'rgba(0,0,0,0.6)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        color: 'white', 
                        fontSize: '0.8rem',
                        zIndex: 11,
                        backdropFilter: 'blur(2px)'
                    }}>
                        <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '4px' }}></div>
                        {fileCount > 1 ? `Đang tải ${fileCount}...` : 'Đang tải...'}
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            ` }} />
        </div>
    );
};

export default ImageUpload;
