import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
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

    if (!['system_admin', 'cep_admin'].includes(user?.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.common.unauthorized')}</div>;
    }

    const resetForm = () => {
        setFormData({ title_en: '', title_rw: '', title_fr: '', content_en: '', content_rw: '', content_fr: '', order_index: 0 });
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

    const inputStyle = {
        width: '100%', padding: '0.65rem 0.75rem',
        borderRadius: '8px', border: '1px solid var(--border)',
        background: 'var(--white)', color: 'var(--text-main)',
        fontSize: '0.9rem', outline: 'none'
    };

    const LangCard = ({ lang, color, title, titleKey, contentKey, titlePlaceholder, contentPlaceholder }) => (
        <div style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: color.bg, color: color.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>{lang}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Section Title</label>
                    <input style={inputStyle} placeholder={titlePlaceholder} value={formData[titleKey]} onChange={e => setFormData({...formData, [titleKey]: e.target.value})} required={lang === 'EN'} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Content / Body</label>
                    <textarea style={{ ...inputStyle, resize: 'none' }} rows={5} placeholder={contentPlaceholder} value={formData[contentKey]} onChange={e => setFormData({...formData, [contentKey]: e.target.value})} required={lang === 'EN'} />
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('admin.about.title')}</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> {t('admin.about.add_btn')}
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
                        width: '100%', maxWidth: '900px',
                        borderRadius: 'var(--radius)',
                        padding: '2.5rem',
                        position: 'relative',
                        background: 'var(--card-bg)',
                        maxHeight: '92vh', overflowY: 'auto',
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
                            {editId ? t('admin.about.edit_title') : t('admin.about.new_title')}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Language Columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <LangCard lang="EN" color={{ bg: 'var(--primary)', text: 'white' }} title="English Content"
                                    titleKey="title_en" contentKey="content_en"
                                    titlePlaceholder="e.g. Our History" contentPlaceholder="Enter English text here..." />
                                <LangCard lang="RW" color={{ bg: '#ffcc00', text: 'black' }} title="Kinyarwanda Content"
                                    titleKey="title_rw" contentKey="content_rw"
                                    titlePlaceholder="Amateka yacu" contentPlaceholder="Andika amagambo mu Kinyarwanda..." />
                                <LangCard lang="FR" color={{ bg: '#0055a4', text: 'white' }} title="Français Content"
                                    titleKey="title_fr" contentKey="content_fr"
                                    titlePlaceholder="ex: Notre Histoire" contentPlaceholder="Entrez le texte en français ici..." />
                            </div>

                            {/* Image & Order */}
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, minWidth: '220px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t('admin.about.field_image')}</label>
                                    <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '1rem', background: 'var(--secondary)', textAlign: 'center' }}>
                                        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ width: '100%', cursor: 'pointer' }} />
                                        {image && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.4rem', fontWeight: 600 }}>📎 {image.name}</p>}
                                    </div>
                                </div>
                                <div style={{ width: '160px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t('admin.about.field_order')}</label>
                                    <input type="number" style={inputStyle} value={formData.order_index}
                                        onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={mutation.isLoading}
                                style={{ width: '100%', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                <Save size={20} />
                                {mutation.isLoading ? t('admin.common.loading') : (editId ? t('admin.common.update') : t('admin.common.save'))}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Sections List ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : sections?.map(section => (
                    <div key={section.id} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {section.image_url ? (
                                <img src={optimizeCloudinaryUrl(section.image_url, { width: 160 })} alt={section.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <ImageIcon style={{ opacity: 0.3 }} />
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{section.title_en}</h3>
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
                        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                            <button onClick={() => handleEdit(section)} style={{ color: 'var(--primary)', background: 'none' }} title="Edit"><Edit2 size={20} /></button>
                            <button onClick={() => deleteMutation.mutate(section.id)} style={{ color: '#ef4444', background: 'none' }} title="Delete"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageAbout;
