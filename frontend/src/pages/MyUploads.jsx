import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Upload, Image as ImageIcon, Video, Trash2, X, Plus, Music, Album } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../api';

const MyUploads = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [selectedTarget, setSelectedTarget] = useState(null); // { type: 'album'|'choir', id, name }
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);

    const { data: permissions, isLoading: loadingPerms } = useQuery({
        queryKey: ['my-permissions'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/auth/me/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const { data: myItems, isLoading: loadingItems } = useQuery({
        queryKey: ['my-gallery-items'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/gallery`);
            const user = JSON.parse(localStorage.getItem('user'));
            return res.data.filter(item => item.uploaded_by === user.id);
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('image', data.file);
            if (data.target.type === 'album') formData.append('album_id', data.target.id);
            if (data.target.type === 'choir') formData.append('choir_id', data.target.id);

            return axios.post(`${API_BASE}/api/gallery`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-gallery-items']);
            addToast(t('admin.gallery.success_create'), 'success');
            setShowUploadForm(false);
            setTitle('');
            setFile(null);
        },
        onError: (err) => addToast(err.response?.data?.message || t('admin.gallery.error_create'), 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/gallery/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-gallery-items']);
            addToast(t('admin.gallery.success_delete'), 'success');
        },
        onError: () => addToast(t('admin.gallery.error_delete'), 'error')
    });

    const handleUpload = (e) => {
        e.preventDefault();
        if (!title || !file || !selectedTarget) {
            return addToast(t('admin.gallery.error_create'), 'warning');
        }
        uploadMutation.mutate({ title, file, target: selectedTarget });
    };

    if (loadingPerms) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('admin.common.loading')}</div>;

    const hasAnyPerm = permissions?.albums?.length > 0 || permissions?.choirs?.length > 0;

    if (!hasAnyPerm && !permissions?.isAdmin) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius)' }}>
                    <h2 style={{ color: 'var(--text-muted)' }}>{t('my_uploads.no_items')}</h2>
                    <p>{t('my_uploads.subtitle')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-uploads-page" style={{ padding: '4rem 0', minHeight: '100vh', background: 'var(--secondary)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('my_uploads.title')} <span style={{ color: 'var(--primary)' }}>{t('my_uploads.span')}</span></h1>
                        <p style={{ color: 'var(--text-muted)' }}>{t('my_uploads.subtitle')}</p>
                    </div>
                </div>

                {/* Managed Sections */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    {permissions.albums.map(album => (
                        <div key={album.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                                    <Album size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{album.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('my_uploads.authorized_albums')}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setSelectedTarget({ type: 'album', id: album.id, name: album.title }); setShowUploadForm(true); }}
                                className="btn-primary" 
                                style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem' }}
                            >
                                <Plus size={16} /> {t('my_uploads.upload_btn')}
                            </button>
                        </div>
                    ))}
                    {permissions.choirs.map(choir => (
                        <div key={choir.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'var(--secondary)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                                    <Music size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{choir.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('my_uploads.authorized_choirs')}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setSelectedTarget({ type: 'choir', id: choir.id, name: choir.name }); setShowUploadForm(true); }}
                                className="btn-primary" 
                                style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem' }}
                            >
                                <Plus size={16} /> {t('my_uploads.upload_btn')}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Uploads History */}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t('admin.gallery.title')}</h2>
                {loadingItems ? <p>{t('admin.common.loading')}</p> : myItems.length === 0 ? (
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                        <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>{t('my_uploads.no_items')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {myItems.map(item => (
                            <div key={item.id} className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
                                {item.media_type === 'video' ? (
                                    <video src={item.image_path.startsWith('http') ? item.image_path : `${API_BASE}${item.image_path}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                ) : (
                                    <img src={item.image_path.startsWith('http') ? item.image_path : `${API_BASE}${item.image_path}`} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                )}
                                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.title}</h4>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            {item.album_id ? 'Album' : 'Choir'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => { if(window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(item.id) }}
                                        style={{ background: 'none', color: '#ef4444' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadForm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1.5rem'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', background: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius)', position: 'relative' }}>
                        <button onClick={() => setShowUploadForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                            Upload to <span style={{ color: 'var(--primary)' }}>{selectedTarget?.name}</span>
                        </h2>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.gallery.field_caption')}</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.gallery.field_file')}</label>
                                <input 
                                    type="file" 
                                    required 
                                    accept="image/*,video/*"
                                    onChange={e => setFile(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <button className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={uploadMutation.isLoading}>
                                {uploadMutation.isLoading ? t('admin.common.loading') : <><Upload size={20} /> {t('my_uploads.upload_btn')}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyUploads;
