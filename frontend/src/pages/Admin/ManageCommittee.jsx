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

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', position: '', bio: '', year_range: '', order_index: 0 });
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

    const inputStyle = {
        width: '100%', padding: '0.75rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--white)',
        color: 'var(--text-main)',
        fontSize: '0.92rem',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block', fontWeight: 600,
        marginBottom: '0.4rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
    };

    return (
        <div>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('admin.committee.title')}</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> {t('admin.committee.add_btn')}
                </button>
            </div>

            {/* ── Modal Form ── */}
            {showForm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, padding: '1rem'
                }}>
                    <div className="glass" style={{
                        width: '100%', maxWidth: '680px',
                        borderRadius: 'var(--radius)',
                        padding: '2.5rem',
                        position: 'relative',
                        background: 'var(--card-bg)',
                        maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
                    }}>
                        <button onClick={resetForm} style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                            background: 'none', color: 'var(--text-muted)', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-main)' }}>
                            {editId ? t('admin.committee.edit_title') : t('admin.committee.new_title')}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>{t('admin.committee.field_name')}</label>
                                <input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('admin.committee.field_position')}</label>
                                <input style={inputStyle} value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('admin.committee.field_year')}</label>
                                <input style={inputStyle} placeholder="e.g. 2024-2025" value={formData.year_range} onChange={e => setFormData({...formData, year_range: e.target.value})} required />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('admin.committee.field_email')}</label>
                                <input type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('admin.committee.field_phone')}</label>
                                <input style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t('admin.committee.field_order')}</label>
                                <input type="number" style={inputStyle} value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>{t('admin.committee.field_bio')}</label>
                                <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>{t('admin.committee.field_image')}</label>
                                <div style={{
                                    border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
                                    padding: '1.25rem', textAlign: 'center', background: 'var(--secondary)'
                                }}>
                                    <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ width: '100%', cursor: 'pointer' }} />
                                    {image && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 600 }}>📎 {image.name}</p>}
                                    {editId && !image && members?.find(m => m.id === editId)?.image_url && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>✓ Current image will be kept</p>
                                    )}
                                </div>
                            </div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                                <button type="submit" className="btn-primary" disabled={mutation.isLoading}
                                    style={{ width: '100%', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                    <Save size={20} />
                                    {mutation.isLoading ? t('admin.common.loading') : (editId ? t('admin.common.update') : t('admin.common.save'))}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Search Bar ── */}
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

            {/* ── Members Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : filteredMembers?.map(member => (
                    <div key={member.id} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius)', display: 'flex', gap: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ width: '90px', height: '110px', borderRadius: '12px', overflow: 'hidden', background: 'var(--secondary)', flexShrink: 0 }}>
                            {member.image_url ? (
                                <img src={optimizeCloudinaryUrl(member.image_url, { width: 180 })} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                                    <ImageIcon />
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button onClick={() => handleEdit(member)} style={{ color: 'var(--primary)', background: 'none' }}><Edit2 size={18} /></button>
                                    <button onClick={() => deleteMutation.mutate(member.id)} style={{ color: '#ef4444', background: 'none' }}><Trash2 size={18} /></button>
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
