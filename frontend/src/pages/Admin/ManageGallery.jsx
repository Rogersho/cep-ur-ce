import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Image as ImageIcon, X, CheckCircle, Upload } from 'lucide-react';

const ManageGallery = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch Gallery Items
    const { data: items, isLoading } = useQuery({
        queryKey: ['admin-gallery'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/gallery');
            return res.data;
        }
    });

    // Create Gallery Item Mutation
    const createMutation = useMutation({
        mutationFn: async (newItem) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', newItem.title);
            data.append('images', newItem.image); // Field name 'images' as per backend route

            return axios.post('http://localhost:5000/api/gallery', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            setMessage({ text: 'Photo added to gallery!', type: 'success' });
            setShowForm(false);
            setTitle('');
            setImage(null);
        },
        onError: (error) => {
            setMessage({ text: error.response?.data?.message || 'Error adding photo', type: 'error' });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`http://localhost:5000/api/gallery/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-gallery']);
            setMessage({ text: 'Photo removed from gallery!', type: 'success' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!image) return setMessage({ text: 'Please select an image', type: 'error' });
        createMutation.mutate({ title, image });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>Gallery</span></h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Upload Photos'}
                </button>
            </div>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    marginBottom: '1.5rem',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle size={20} />
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem', maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Photo Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => setImage(e.target.files[0])}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={createMutation.isLoading}>
                            <Upload size={20} />
                            {createMutation.isLoading ? 'Uploading...' : 'Start Upload'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {isLoading ? (
                    <p>Loading gallery items...</p>
                ) : items?.length === 0 ? (
                    <p>No photos found.</p>
                ) : items.map(item => (
                    <div key={item.id} className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: '150px' }}>
                            <img src={`http://localhost:5000${item.image_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
                            <button
                                onClick={() => { if (window.confirm('Delete this photo?')) deleteMutation.mutate(item.id) }}
                                style={{ color: '#ef4444', background: 'none' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageGallery;
