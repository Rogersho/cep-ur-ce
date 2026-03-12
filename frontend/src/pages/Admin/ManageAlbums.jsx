import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Folder, X, Upload, Users, Shield, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';
import { Link } from 'react-router-dom';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const ManageAlbums = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showPermModal, setShowPermModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }

    // Form State
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [image, setImage] = useState(null);

    // Fetch Albums
    const { data: albums, isLoading } = useQuery({
        queryKey: ['admin-albums'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/albums`);
            return res.data;
        }
    });

    // Fetch All Users (for permissions)
    const { data: users } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/auth/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Fetch Permissions for Selected Album
    const { data: permissions, refetch: refetchPermissions } = useQuery({
        queryKey: ['album-permissions', selectedAlbum?.id],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/albums/${selectedAlbum.id}/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!selectedAlbum
    });

    // Mutations: Album
    const createAlbumMutation = useMutation({
        mutationFn: async (newAlbum) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', newAlbum.title);
            data.append('description', newAlbum.description);
            if (image) data.append('image', image);

            return axios.post(`${API_BASE}/api/albums`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-albums']);
            addToast('Album created successfully', 'success');
            resetForm();
        },
        onError: () => addToast('Error creating album', 'error')
    });

    const updateAlbumMutation = useMutation({
        mutationFn: async (updatedAlbum) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', updatedAlbum.title);
            data.append('description', updatedAlbum.description);
            if (image) data.append('image', image);

            return axios.put(`${API_BASE}/api/albums/${editId}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-albums']);
            addToast('Album updated successfully', 'success');
            resetForm();
        },
        onError: () => addToast('Error updating album', 'error')
    });

    const deleteAlbumMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/albums/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-albums']);
            addToast('Album deleted successfully', 'success');
        },
        onError: () => addToast('Error deleting album', 'error')
    });

    // Mutations: Permissions
    const grantPermissionMutation = useMutation({
        mutationFn: async (userId) => {
            const token = localStorage.getItem('token');
            return axios.post(`${API_BASE}/api/albums/${selectedAlbum.id}/permissions`, { userId }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            refetchPermissions();
            addToast('Permission granted', 'success');
        },
        onError: () => addToast('Error granting permission', 'error')
    });

    const revokePermissionMutation = useMutation({
        mutationFn: async (userId) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/albums/${selectedAlbum.id}/permissions/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            refetchPermissions();
            addToast('Permission revoked', 'info');
        },
        onError: () => addToast('Error revoking permission', 'error')
    });

    const resetForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: '', description: '' });
        setImage(null);
    };

    const handleEdit = (album) => {
        setFormData({ title: album.title, description: album.description || '' });
        setEditId(album.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenPermissions = (album) => {
        setSelectedAlbum(album);
        setShowPermModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) updateAlbumMutation.mutate(formData);
        else createAlbumMutation.mutate(formData);
    };

    return (
        <div>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>Albums</span></h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) resetForm();
                    }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('admin.common.cancel') : 'Create Album'}
                </button>
            </div>

            {/* Album Form */}
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
                        <button onClick={resetForm} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            {isEditing ? 'Edit Album' : 'New Album'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Title <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Cover Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={createAlbumMutation.isLoading || updateAlbumMutation.isLoading}>
                                <Upload size={20} />
                                {isEditing ?
                                    (updateAlbumMutation.isLoading ? t('admin.common.loading') : t('admin.common.update')) :
                                    (createAlbumMutation.isLoading ? t('admin.common.loading') : 'Create Album')
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Albums Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : albums?.length === 0 ? (
                    <p>No albums found. Create one above.</p>
                ) : albums.map(album => (
                    <div key={album.id} className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '160px', position: 'relative', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {album.cover_image ? (
                                <img src={album.cover_image.startsWith('http') ? optimizeCloudinaryUrl(album.cover_image, { width: 400, height: 300 }) : `${API_BASE}${album.cover_image}`} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                            ) : (
                                <Folder size={64} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                            )}
                            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                {album.item_count} Items
                            </div>
                        </div>
                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{album.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {album.description || 'No description'}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button onClick={() => handleEdit(album)} className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center', justifyContent: 'center' }}>
                                    Edit
                                </button>
                                <button onClick={() => handleOpenPermissions(album)} className="glass" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', border: '1px solid var(--border)' }}>
                                    <Shield size={14} /> Perms
                                </button>
                                <button onClick={() => { if (window.confirm('Delete album?')) deleteAlbumMutation.mutate(album.id) }} style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Permissions Modal */}
            {showPermModal && selectedAlbum && (
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
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)' }}>
                        <button onClick={() => setShowPermModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={24} color="var(--primary)" /> Permissions
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Manage who can upload photos to <strong>{selectedAlbum.title}</strong>
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Assign New User</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    id="userSelect"
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                >
                                    <option value="">Select a user...</option>
                                    {users?.filter(u => u.role !== 'admin' && !permissions?.find(p => p.user_id === u.id)).map(u => (
                                        <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        const userId = document.getElementById('userSelect').value;
                                        if (userId) grantPermissionMutation.mutate(userId);
                                    }}
                                    className="btn-primary"
                                    style={{ padding: '0.75rem 1rem' }}
                                >
                                    Grant
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Currently Authorized Users</h3>
                            {permissions?.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No members granted access yet (Admins have default access).</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {permissions?.map(perm => (
                                        <div key={perm.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {perm.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>{perm.username}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{perm.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => revokePermissionMutation.mutate(perm.user_id)} style={{ color: '#ef4444', background: 'none', padding: '0.25rem' }} title="Revoke Permission">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAlbums;
