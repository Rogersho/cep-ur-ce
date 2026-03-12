import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, MoveSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const ManageAbout = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        title_en: '', title_rw: '', title_fr: '',
        content_en: '', content_rw: '', content_fr: '',
        order_index: 0
    });
    const user = JSON.parse(localStorage.getItem('user'));

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }

    const { data: sections, isLoading } = useQuery({
        queryKey: ['admin-about'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/about`);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            Object.keys(data).forEach(key => submitData.append(key, data[key]));
            if (image) submitData.append('image', image);

            if (editId) {
                return axios.put(`${API_BASE}/api/about/${editId}`, submitData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            return axios.post(`${API_BASE}/api/about`, submitData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-about']);
            addToast(editId ? t('admin.about.success_update') : t('admin.about.success_create'), 'success');
            resetForm();
        },
        onError: () => addToast('Error processing request', 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/about/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-about']);
            addToast(t('admin.about.success_delete'), 'success');
        }
    });

    const resetForm = () => {
        setFormData({
            title_en: '', title_rw: '', title_fr: '',
            content_en: '', content_rw: '', content_fr: '',
            order_index: 0
        });
        setImage(null);
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (section) => {
        setEditId(section.id);
        setFormData({
            title_en: section.title_en || '',
            title_rw: section.title_rw || '',
            title_fr: section.title_fr || '',
            content_en: section.content_en || '',
            content_rw: section.content_rw || '',
            content_fr: section.content_fr || '',
            order_index: section.order_index || 0
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('admin.about.title')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage the About Us sections and committees.</p>
                </div>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={20} /> {t('admin.about.add_btn')}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{editId ? t('admin.about.edit_title') : t('admin.about.new_title')}</h2>
                        <button onClick={resetForm} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* English Content */}
                        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>EN</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>English Content</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Section Title</label>
                                    <input 
                                        className="glass-input" 
                                        placeholder="e.g. Our History" 
                                        value={formData.title_en} 
                                        onChange={e => setFormData({...formData, title_en: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description/Body</label>
                                    <textarea 
                                        className="glass-input" 
                                        placeholder="Enter the English text here..." 
                                        rows={8}
                                        value={formData.content_en} 
                                        onChange={e => setFormData({...formData, content_en: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kinyarwanda Content */}
                        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffcc00', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>RW</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Kinyarwanda Content</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Umutwe (Title)</label>
                                    <input 
                                        className="glass-input" 
                                        placeholder="Amateka yacu" 
                                        value={formData.title_rw} 
                                        onChange={e => setFormData({...formData, title_rw: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Ibirimo (Content)</label>
                                    <textarea 
                                        className="glass-input" 
                                        placeholder="Andika amagambo mu Kinyarwanda..." 
                                        rows={8}
                                        value={formData.content_rw} 
                                        onChange={e => setFormData({...formData, content_rw: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Français Content */}
                        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0055a4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>FR</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Français Content</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Titre de la section</label>
                                    <input 
                                        className="glass-input" 
                                        placeholder="ex: Notre Histoire" 
                                        value={formData.title_fr} 
                                        onChange={e => setFormData({...formData, title_fr: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contenu</label>
                                    <textarea 
                                        className="glass-input" 
                                        placeholder="Entrez le texte en français ici..." 
                                        rows={8}
                                        value={formData.content_fr} 
                                        onChange={e => setFormData({...formData, content_fr: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Global Settings */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: '1 / -1' }}>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.about.field_image')}</label>
                                    <input type="file" onChange={e => setImage(e.target.files[0])} />
                                </div>
                                <div style={{ width: '150px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.about.field_order')}</label>
                                    <input 
                                        type="number" 
                                        className="glass-input" 
                                        value={formData.order_index} 
                                        onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={mutation.isLoading} style={{ marginTop: '1rem' }}>
                                <Save size={20} /> {mutation.isLoading ? t('admin.common.loading') : (editId ? t('admin.common.update') : t('admin.common.save'))}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : sections?.map(section => (
                    <div key={section.id} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {section.image_url ? (
                                <img src={optimizeCloudinaryUrl(section.image_url, { width: 160 })} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <ImageIcon style={{ opacity: 0.3 }} />
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: 700 }}>{section.title_en}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                                {section.content_en}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span className="glass" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Order: {section.order_index}</span>
                                <span className="glass" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>EN</span>
                                {section.title_rw && <span className="glass" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>RW</span>}
                                {section.title_fr && <span className="glass" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>FR</span>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => handleEdit(section)} style={{ color: 'var(--primary)' }} title="Edit"><Edit2 size={20} /></button>
                            <button onClick={() => deleteMutation.mutate(section.id)} style={{ color: '#ef4444' }} title="Delete"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageAbout;
