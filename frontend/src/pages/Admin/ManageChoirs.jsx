import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Music, X, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

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

    const { data: choirs, isLoading } = useQuery({
        queryKey: ['admin-choirs'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/choirs');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newChoir) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', newChoir.name);
            data.append('description', newChoir.description);
            data.append('leader_name', newChoir.leader_name);
            if (thumbnail) data.append('image', thumbnail);

            return axios.post('http://localhost:5000/api/choirs', data, {
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

            return axios.put(`http://localhost:5000/api/choirs/${editId}`, data, {
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
            return axios.delete(`http://localhost:5000/api/choirs/${id}`, {
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

    const resetForm = () => {
        setFormData({ name: '', description: '', leader_name: '' });
        setThumbnail(null);
        setIsEditing(false);
        setEditId(null);
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
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem', maxWidth: '800px' }}>
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handleEdit(choir)}
                                style={{ color: 'var(--primary)', background: 'none' }}
                                className="hover-scale"
                            >
                                <Music size={20} />
                            </button>
                            <button
                                onClick={() => { if (window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(choir.id) }}
                                style={{ color: '#ef4444', background: 'none' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
