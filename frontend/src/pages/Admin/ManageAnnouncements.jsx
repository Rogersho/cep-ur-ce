import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Megaphone, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';

const ManageAnnouncements = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'Normal'
    });

    const { data: announcements, isLoading } = useQuery({
        queryKey: ['admin-announcements'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/announcements`);
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newAnn) => {
            const token = localStorage.getItem('token');
            return axios.post(`${API_BASE}/api/announcements`, newAnn, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-announcements']);
            addToast(t('admin.news.success_create'), 'success');
            setShowForm(false);
            setFormData({ title: '', content: '', priority: 'Normal' });
        },
        onError: (error) => {
            addToast(t('admin.news.error_create'), 'error');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedAnn) => {
            const token = localStorage.getItem('token');
            return axios.put(`${API_BASE}/api/announcements/${editId}`, updatedAnn, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-announcements']);
            addToast(t('admin.news.success_update'), 'success');
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({ title: '', content: '', priority: 'Normal' });
        },
        onError: () => addToast(t('admin.news.error_update'), 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/announcements/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-announcements']);
            addToast(t('admin.news.success_delete'), 'success');
        },
        onError: () => addToast(t('admin.news.error_delete'), 'error')
    });

    const handleEdit = (ann) => {
        setFormData({
            title: ann.title,
            content: ann.content,
            priority: ann.priority
        });
        setEditId(ann.id);
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
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>{t('nav.news')}</span></h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) { setIsEditing(false); setFormData({ title: '', content: '', priority: 'Normal' }); }
                    }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('admin.common.cancel') : t('admin.news.add_btn')}
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
                        <button onClick={() => { setShowForm(false); setIsEditing(false); setFormData({ title: '', content: '', priority: 'Normal' }); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            {isEditing ? t('admin.news.edit_title') : t('admin.news.new_title')}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.news.field_title')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.news.field_priority')}</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                >
                                    <option value="Normal">{t('admin.news.priority_normal')}</option>
                                    <option value="High">{t('admin.news.priority_high')}</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.news.field_content')}</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', resize: 'none' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem' }} disabled={createMutation.isLoading || updateMutation.isLoading}>
                                {isEditing ?
                                    (updateMutation.isLoading ? t('admin.common.loading') : t('admin.common.update')) :
                                    (createMutation.isLoading ? t('admin.common.loading') : t('admin.common.add'))
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : announcements?.length === 0 ? (
                    <p>{t('admin.common.no_data')}</p>
                ) : announcements.map(ann => (
                    <div key={ann.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: ann.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'var(--secondary)',
                                color: ann.priority === 'High' ? '#ef4444' : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {ann.priority === 'High' ? <AlertCircle size={20} /> : <Megaphone size={20} />}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{ann.title}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(ann.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(ann)} style={{ color: 'var(--primary)', background: 'none' }} className="hover-scale">
                                <Megaphone size={20} />
                            </button>
                            <button onClick={() => { if (window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(ann.id) }} style={{ color: '#ef4444', background: 'none' }}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageAnnouncements;
