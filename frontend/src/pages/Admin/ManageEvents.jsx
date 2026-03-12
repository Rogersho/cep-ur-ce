import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Calendar, MapPin, Clock, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';

const ManageEvents = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));


    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: ''
    });
    const [image, setImage] = useState(null);

    // Fetch Events
    const { data: events, isLoading } = useQuery({
        queryKey: ['admin-events'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/events`);
            return res.data;
        }
    });

    // Create Event Mutation
    const createMutation = useMutation({
        mutationFn: async (newEvent) => {
            const token = localStorage.getItem('token');
            const data = new FormData();

            // Fix date format for MySQL (YYYY-MM-DD HH:mm:ss)
            const formattedDate = newEvent.date.replace('T', ' ');

            Object.keys(newEvent).forEach(key => {
                if (key === 'date') {
                    data.append('date', formattedDate);
                } else {
                    data.append(key, newEvent[key]);
                }
            });
            if (image) data.append('image', image);

            return axios.post(`${API_BASE}/api/events`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            addToast(t('admin.events.success_create'), 'success');
            setShowForm(false);
            resetForm();
        },
        onError: (error) => {
            const msg = error.response?.data?.error || error.response?.data?.message || t('admin.events.error_create');
            addToast(msg, 'error');
        }
    });

    // Update Event Mutation
    const updateMutation = useMutation({
        mutationFn: async (updatedEvent) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            const formattedDate = updatedEvent.date.replace('T', ' ');

            Object.keys(updatedEvent).forEach(key => {
                if (key === 'date') {
                    data.append('date', formattedDate);
                } else {
                    data.append(key, updatedEvent[key]);
                }
            });
            if (image) data.append('image', image);

            return axios.put(`${API_BASE}/api/events/${editId}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            addToast(t('admin.events.success_update'), 'success');
            setShowForm(false);
            resetForm();
        },
        onError: (error) => {
            addToast(t('admin.events.error_update'), 'error');
        }
    });

    // Delete Event Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/events/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            addToast(t('admin.events.success_delete'), 'success');
        },
        onError: (error) => {
            addToast(t('admin.events.error_delete'), 'error');
        }
    });

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }

    const resetForm = () => {
        setFormData({ title: '', description: '', date: '', location: '', category: '' });
        setImage(null);
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            date: event.event_date.split('.')[0], // Remove ms if present for datetime-local
            location: event.location,
            category: event.category || ''
        });
        setEditId(event.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileUpload = (e) => {
        setImage(e.target.files[0]);
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
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('admin.nav.events')}</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('admin.common.cancel') : t('admin.events.add_btn')}
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
                    <div className="glass" style={{ width: '100%', maxWidth: '750px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => { setShowForm(false); resetForm(); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                            {isEditing ? t('admin.events.edit_title') : t('admin.events.new_title')}
                        </h2>
                        <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-full" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.events.field_title')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div className="form-half">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.events.field_date')}</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div className="form-half">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.events.field_location')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div className="form-full" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.events.field_desc')}</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', resize: 'none' }}
                                />
                            </div>

                            <div className="form-full" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.events.field_image')}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div className="form-full" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={createMutation.isLoading || updateMutation.isLoading}>
                                    {isEditing ?
                                        (updateMutation.isLoading ? t('admin.common.loading') : t('admin.common.update')) :
                                        (createMutation.isLoading ? t('admin.common.loading') : t('admin.common.add'))
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)', fontWeight: 700 }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>{t('admin.events.field_title')}</th>
                                <th style={{ padding: '1rem' }}>{t('admin.events.field_date')} / {t('admin.events.field_location')}</th>
                                <th style={{ padding: '1rem' }}>{t('admin.common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.loading')}</td></tr>
                            ) : events?.length === 0 ? (
                                <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.no_data')}</td></tr>
                            ) : events.map(event => (
                                <tr key={event.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={event.image_url?.startsWith('http') ? event.image_url : `${API_BASE}${event.image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{event.title}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(event.event_date).toLocaleDateString()}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.location}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(event)}
                                            style={{ color: 'var(--primary)', background: 'none' }}
                                            className="hover-scale"
                                        >
                                            <Calendar size={20} />
                                        </button>
                                        <button
                                            onClick={() => { if (window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(event.id) }}
                                            style={{ color: '#ef4444', background: 'none' }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .admin-header {
                        flex-direction: column;
                        align-items: stretch !important;
                    }
                    .admin-form {
                        grid-template-columns: 1fr !important;
                    }
                    .form-full {
                        grid-column: span 1 !important;
                    }
                    .form-half {
                        grid-column: span 1 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ManageEvents;
