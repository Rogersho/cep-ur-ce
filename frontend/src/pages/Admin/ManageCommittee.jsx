import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const ManageCommittee = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [image, setImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        position: '', bio: '', year_range: '',
        order_index: 0
    });
    const user = JSON.parse(localStorage.getItem('user'));

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }

    const { data: members, isLoading } = useQuery({
        queryKey: ['admin-committee'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/committee`);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    submitData.append(key, data[key]);
                }
            });
            if (image) submitData.append('image', image);

            if (editId) {
                return axios.put(`${API_BASE}/api/committee/${editId}`, submitData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            return axios.post(`${API_BASE}/api/committee`, submitData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-committee']);
            addToast(editId ? t('admin.committee.success_update') : t('admin.committee.success_create'), 'success');
            resetForm();
        },
        onError: () => addToast('Error processing request', 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            if (!window.confirm(t('admin.common.confirm_delete'))) return;
            return axios.delete(`${API_BASE}/api/committee/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-committee']);
            addToast(t('admin.committee.success_delete'), 'success');
        }
    });

    const resetForm = () => {
        setFormData({
            name: '', email: '', phone: '',
            position: '', bio: '', year_range: '',
            order_index: 0
        });
        setImage(null);
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (member) => {
        setEditId(member.id);
        setFormData({
            name: member.name || '',
            email: member.email || '',
            phone: member.phone || '',
            position: member.position || '',
            bio: member.bio || '',
            year_range: member.year_range || '',
            order_index: member.order_index || 0
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const filteredMembers = members?.filter(m => 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.year_range?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('admin.committee.title')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage the leadership committee and academic years.</p>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                    >
                        <Plus size={20} /> {t('admin.committee.add_btn')}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editId ? t('admin.committee.edit_title') : t('admin.committee.new_title')}</h2>
                        <button onClick={resetForm} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="input-label">{t('admin.committee.field_name')}</label>
                            <input 
                                className="glass-input" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="input-label">{t('admin.committee.field_position')}</label>
                            <input 
                                className="glass-input" 
                                value={formData.position} 
                                onChange={e => setFormData({...formData, position: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="input-label">{t('admin.committee.field_year')}</label>
                            <input 
                                className="glass-input" 
                                placeholder="2024-2025"
                                value={formData.year_range} 
                                onChange={e => setFormData({...formData, year_range: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="input-label">{t('admin.committee.field_email')}</label>
                            <input 
                                type="email"
                                className="glass-input" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="input-label">{t('admin.committee.field_phone')}</label>
                            <input 
                                className="glass-input" 
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="input-label">{t('admin.committee.field_order')}</label>
                            <input 
                                type="number"
                                className="glass-input" 
                                value={formData.order_index} 
                                onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">{t('admin.committee.field_bio')}</label>
                            <textarea 
                                className="glass-input" 
                                rows={3}
                                value={formData.bio} 
                                onChange={e => setFormData({...formData, bio: e.target.value})}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="input-label">{t('admin.committee.field_image')}</label>
                            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                            {editId && !image && members?.find(m => m.id === editId)?.image_url && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Current image exists.</p>
                            )}
                        </div>

                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" disabled={mutation.isLoading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={20} /> {mutation.isLoading ? t('admin.common.loading') : (editId ? t('admin.common.update') : t('admin.common.save'))}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border)' }}>
                <Search size={20} color="var(--text-muted)" />
                <input 
                    type="text" 
                    placeholder="Search committee by name, year or position..." 
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '1rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : filteredMembers?.map(member => (
                    <div key={member.id} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius)', display: 'flex', gap: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ width: '90px', height: '110px', borderRadius: '12px', overflow: 'hidden', background: 'var(--secondary)', flexShrink: 0 }}>
                            {member.image_url ? (
                                <img src={optimizeCloudinaryUrl(member.image_url, { width: 180 })} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                                    <ImageIcon />
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(member)} className="icon-btn-edit" style={{ color: 'var(--primary)' }}><Edit2 size={18} /></button>
                                    <button onClick={() => deleteMutation.mutate(member.id)} className="icon-btn-delete" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{member.position}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Year: {member.year_range}</p>
                            {member.bio && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {member.bio}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCommittee;
