import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Music, X, CheckCircle, Upload, Shield, Users } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';

const ManageChoirs = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        leader_name: ''
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [showPermModal, setShowPermModal] = useState(false);
    const [selectedChoir, setSelectedChoir] = useState(null);

    const { data: choirs, isLoading } = useQuery({
        queryKey: ['admin-choirs'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/choirs`);
            return res.data;
        }
    });

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

    const { data: permissions, refetch: refetchPermissions } = useQuery({
        queryKey: ['choir-permissions', selectedChoir?.id],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/choirs/${selectedChoir.id}/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!selectedChoir
    });

    const createMutation = useMutation({
        mutationFn: async (newChoir) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', newChoir.name);
            data.append('description', newChoir.description);
            data.append('leader_name', newChoir.leader_name);
            if (thumbnail) data.append('image', thumbnail);

            return axios.post(`${API_BASE}/api/choirs`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-choirs']);
            addToast(t('admin.choirs.success_create'), 'success');
            setShowForm(false);
            resetForm();
        },
        onError: (error) => {
            const msg = error.response?.data?.error || error.response?.data?.message || t('admin.choirs.error_create');
            addToast(msg, 'error');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedChoir) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', updatedChoir.name);
            data.append('description', updatedChoir.description);
            data.append('leader_name', updatedChoir.leader_name);
            if (thumbnail) data.append('image', thumbnail);

            return axios.put(`${API_BASE}/api/choirs/${editId}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-choirs']);
            addToast(t('admin.choirs.success_update'), 'success');
            setShowForm(false);
            resetForm();
        },
        onError: (error) => {
            addToast(t('admin.choirs.error_update'), 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/choirs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-choirs']);
            addToast(t('admin.choirs.success_delete'), 'success');
        },
        onError: (error) => {
            addToast(t('admin.choirs.error_delete'), 'error');
        }
    });

    const grantPermissionMutation = useMutation({
        mutationFn: async (userId) => {
            const token = localStorage.getItem('token');
            return axios.post(`${API_BASE}/api/choirs/${selectedChoir.id}/permissions`, { userId }, {
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
            return axios.delete(`${API_BASE}/api/choirs/${selectedChoir.id}/permissions/${userId}`, {
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
        setFormData({ name: '', description: '', leader_name: '' });
        setThumbnail(null);
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    const handleOpenPermissions = (choir) => {
        setSelectedChoir(choir);
        setShowPermModal(true);
    };

    const handleEdit = (choir) => {
        setFormData({
            name: choir.name,
            description: choir.description,
            leader_name: choir.leader_name
        });
        setEditId(choir.id);
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
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>{t('nav.choirs')}</span></h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('admin.common.cancel') : t('admin.choirs.add_btn')}
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
                    <div className="glass" style={{ width: '100%', maxWidth: '650px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => { setShowForm(false); resetForm(); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                            {isEditing ? t('admin.choirs.edit_title') : t('admin.choirs.new_title')}
                        </h2>
                        <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-item">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.choirs.field_name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                    />
                                </div>
                                <div className="form-item">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.choirs.field_leader')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.leader_name}
                                        onChange={(e) => setFormData({ ...formData, leader_name: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.choirs.field_desc')}</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', resize: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.choirs.field_thumbnail')}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={createMutation.isLoading || updateMutation.isLoading}>
                                <Upload size={20} />
                                {isEditing ?
                                    (updateMutation.isLoading ? t('admin.common.loading') : t('admin.common.update')) :
                                    (createMutation.isLoading ? t('admin.common.loading') : t('admin.common.add'))
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : choirs?.length === 0 ? (
                    <p>{t('admin.common.no_data')}</p>
                ) : choirs.map(choir => (
                    <div key={choir.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Music size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{choir.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('choirs.leader')}: {choir.leader_name}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                                onClick={() => handleEdit(choir)}
                                style={{ color: 'var(--primary)', background: 'none', padding: '0.25rem' }}
                                title="Edit"
                            >
                                <Music size={18} />
                            </button>
                            <button
                                onClick={() => handleOpenPermissions(choir)}
                                style={{ color: 'var(--primary)', background: 'none', padding: '0.25rem' }}
                                title="Permissions"
                            >
                                <Shield size={18} />
                            </button>
                            <button
                                onClick={() => { if (window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(choir.id) }}
                                style={{ color: '#ef4444', background: 'none', padding: '0.25rem' }}
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Permissions Modal */}
            {showPermModal && selectedChoir && (
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
                            <Shield size={24} color="var(--primary)" /> {t('admin.permissions.title')}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Manage who can upload items to <strong>{selectedChoir.name}</strong> gallery
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
                                    {t('admin.permissions.grant')}
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{t('admin.permissions.authorized_users')}</h3>
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
                                            <button
                                                onClick={() => revokePermissionMutation.mutate(perm.user_id)}
                                                style={{ background: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            >
                                                <X size={14} /> {t('admin.permissions.revoke')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .admin-header {
                        flex-direction: column;
                        align-items: stretch !important;
                    }
                    .form-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .choirs-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ManageChoirs;
