import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const ManageGallery = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        album_id: '',
        choir_id: ''
    });
    const [image, setImage] = useState(null);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const { data: gallery, isLoading } = useQuery({
        queryKey: ['admin-gallery'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/gallery`);
            return res.data;
        }
    });

    const { data: albums } = useQuery({
        queryKey: ['admin-albums'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/albums`);
            return res.data;
        }
    });

    const { data: choirs } = useQuery({
        queryKey: ['admin-choirs'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/choirs`);
            return res.data;
        }
    });

    const createAlbumMutation = useMutation({
        mutationFn: async (title) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', title);
            data.append('description', '');

            return axios.post(`${API_BASE}/api/albums`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin-albums']);
            addToast('Album created successfully', 'success');
            setShowAlbumModal(false);
            setNewAlbumTitle('');
            // Auto-select the newly created album
            if (res.data && res.data.id) {
                setFormData(prev => ({ ...prev, album_id: res.data.id }));
            }
        },
        onError: () => addToast('Error creating album', 'error')
    });

    const createMutation = useMutation({
        mutationFn: async (newPhoto) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', newPhoto.title);
            if (newPhoto.choir_id) data.append('choir_id', newPhoto.choir_id);
            if (image) data.append('image', image);

            // If an album is selected and it's a new photo, upload to the album endpoint
            const endpoint = newPhoto.album_id ? `/api/albums/${newPhoto.album_id}/upload` : '/api/gallery';

            return axios.post(`${API_BASE}${endpoint}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            addToast(t('admin.gallery.success_create'), 'success');
            setShowForm(false);
            setFormData({ title: '', album_id: '', choir_id: '' });
            setImage(null);
        },
        onError: () => addToast(t('admin.gallery.error_create'), 'error')
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedPhoto) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', updatedPhoto.title);
            if (updatedPhoto.choir_id) data.append('choir_id', updatedPhoto.choir_id);
            if (image) data.append('image', image);

            return axios.put(`${API_BASE}/api/gallery/${editId}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            addToast(t('admin.gallery.success_update'), 'success');
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({ title: '', album_id: '', choir_id: '' });
            setImage(null);
        },
        onError: () => addToast(t('admin.gallery.error_update'), 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/gallery/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            addToast(t('admin.gallery.success_delete'), 'success');
        },
        onError: () => addToast(t('admin.gallery.error_delete'), 'error')
    });

    const handleEdit = (photo) => {
        setFormData({ 
            title: photo.title,
            album_id: photo.album_id || '',
            choir_id: photo.choir_id || ''
        });
        setEditId(photo.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>{t('nav.gallery')}</span></h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) { setIsEditing(false); setFormData({ title: '', album_id: '', choir_id: '' }); setImage(null); }
                    }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('admin.common.cancel') : t('admin.gallery.add_btn')}
                </button>
            </div>

            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '1rem'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => { setShowForm(false); setIsEditing(false); setFormData({ title: '', album_id: '', choir_id: '' }); setImage(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            {isEditing ? t('admin.gallery.edit_title') : t('admin.gallery.new_title')}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.gallery.field_caption')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>

                            {!isEditing && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Album</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                            required={!formData.choir_id}
                                            value={formData.album_id}
                                            onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
                                            style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                        >
                                            <option value="" disabled={!formData.choir_id}>Select an Album</option>
                                            {albums?.map(album => (
                                                <option key={album.id} value={album.id}>{album.title}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowAlbumModal(true)}
                                            className="btn-primary"
                                            style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}
                                        >
                                            <Plus size={16} /> New
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Assign to Choir (Optional)</label>
                                <select
                                    value={formData.choir_id}
                                    onChange={(e) => setFormData({ ...formData, choir_id: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                >
                                    <option value="">None / General Community</option>
                                    {choirs?.map(choir => (
                                        <option key={choir.id} value={choir.id}>{choir.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>File (Image / Video)</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={createMutation.isLoading || updateMutation.isLoading}>
                                <Upload size={20} />
                                {isEditing ?
                                    (updateMutation.isLoading ? t('admin.common.loading') : t('admin.common.update')) :
                                    (createMutation.isLoading ? t('admin.common.loading') : t('admin.gallery.add_btn'))
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Create Album Modal */}
            {showAlbumModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    padding: '1rem'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)' }}>
                        <button onClick={() => setShowAlbumModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create New Album</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Album Title</label>
                                <input
                                    type="text"
                                    value={newAlbumTitle}
                                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                                    placeholder="E.g. Retreat 2026"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (newAlbumTitle.trim()) {
                                        createAlbumMutation.mutate(newAlbumTitle);
                                    } else {
                                        addToast('Title is required', 'error');
                                    }
                                }}
                                className="btn-primary"
                                style={{ padding: '0.75rem', width: '100%' }}
                                disabled={createAlbumMutation.isLoading}
                            >
                                {createAlbumMutation.isLoading ? t('admin.common.loading') : 'Save Album'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : gallery?.length === 0 ? (
                    <p>{t('admin.common.no_data')}</p>
                ) : gallery.map(photo => (
                    <div key={photo.id} className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
                        {photo.media_type === 'video' ? (
                            <video src={photo.image_path.startsWith('http') ? optimizeCloudinaryUrl(photo.image_path, { width: 400, height: 300 }) : `${API_BASE}${photo.image_path}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} controls controlsList="nodownload" />
                        ) : (
                            <img 
                                src={photo.image_path.startsWith('http') ? optimizeCloudinaryUrl(photo.image_path, { width: 400, height: 300 }) : `${API_BASE}${photo.image_path}`} 
                                alt={photo.title} 
                                style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
                                loading="lazy"
                            />
                        )}
                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{photo.title}</p>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button onClick={() => handleEdit(photo)} style={{ color: 'var(--primary)', background: 'none' }}>
                                        <ImageIcon size={18} />
                                    </button>
                                    <button onClick={() => { if (window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(photo.id) }} style={{ color: '#ef4444', background: 'none' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            {photo.choir_id && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    Choir: {choirs?.find(c => c.id === photo.choir_id)?.name || 'Linked'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageGallery;
