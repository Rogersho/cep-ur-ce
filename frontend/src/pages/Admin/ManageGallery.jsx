import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

const ManageGallery = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        caption: ''
    });
    const [image, setImage] = useState(null);

    const { data: gallery, isLoading } = useQuery({
        queryKey: ['admin-gallery'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/gallery');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newPhoto) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('caption', newPhoto.caption);
            if (image) data.append('image', image);

            return axios.post('http://localhost:5000/api/gallery', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            addToast(t('admin.gallery.success_create'), 'success');
            setShowForm(false);
            setFormData({ caption: '' });
            setImage(null);
        },
        onError: () => addToast(t('admin.gallery.error_create'), 'error')
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedPhoto) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('caption', updatedPhoto.caption);
            if (image) data.append('image', image);

            return axios.put(`http://localhost:5000/api/gallery/${editId}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            addToast(t('admin.gallery.success_update'), 'success');
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({ caption: '' });
            setImage(null);
        },
        onError: () => addToast(t('admin.gallery.error_update'), 'error')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`http://localhost:5000/api/gallery/${id}`, {
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
        setFormData({ caption: photo.caption });
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
                        if (showForm) { setIsEditing(false); setFormData({ caption: '' }); setImage(null); }
                    }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('admin.common.cancel') : t('admin.gallery.add_btn')}
                </button>
            </div>

            {showForm && (
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem', maxWidth: '600px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        {isEditing ? t('admin.gallery.edit_title') : t('admin.gallery.new_title')}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.gallery.field_caption')}</label>
                            <input
                                type="text"
                                required
                                value={formData.caption}
                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('admin.gallery.field_file')}</label>
                            <input
                                type="file"
                                accept="image/*"
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
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {isLoading ? (
                    <p>{t('admin.common.loading')}</p>
                ) : gallery?.length === 0 ? (
                    <p>{t('admin.common.no_data')}</p>
                ) : gallery.map(photo => (
                    <div key={photo.id} className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
                        <img src={`http://localhost:5000${photo.image_url}`} alt={photo.caption} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.caption}</p>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button onClick={() => handleEdit(photo)} style={{ color: 'var(--primary)', background: 'none' }}>
                                    <ImageIcon size={18} />
                                </button>
                                <button onClick={() => { if (window.confirm(t('admin.common.confirm_delete'))) deleteMutation.mutate(photo.id) }} style={{ color: '#ef4444', background: 'none' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageGallery;
