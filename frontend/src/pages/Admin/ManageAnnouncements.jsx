import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Megaphone, X, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const ManageAnnouncements = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        importance: 'normal'
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch Announcements
    const { data: announcements, isLoading } = useQuery({
        queryKey: ['admin-announcements'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/announcements');
            return res.data;
        }
    });

    // Create Announcement Mutation
    const createMutation = useMutation({
        mutationFn: async (newAnnouncement) => {
            const token = localStorage.getItem('token');
            return axios.post('http://localhost:5000/api/announcements', newAnnouncement, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-announcements']);
            setMessage({ text: 'Announcement published successfully!', type: 'success' });
            setShowForm(false);
            setFormData({ title: '', content: '', importance: 'normal' });
        },
        onError: (error) => {
            setMessage({ text: error.response?.data?.message || 'Error publishing announcement', type: 'error' });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`http://localhost:5000/api/announcements/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-announcements']);
            setMessage({ text: 'Announcement deleted successfully!', type: 'success' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>Announcements</span></h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'New Announcement'}
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
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem', maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Importance</label>
                            <select
                                value={formData.importance}
                                onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            >
                                <option value="normal">Normal</option>
                                <option value="high">High (Marked Red)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Content</label>
                            <textarea
                                required
                                rows="5"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', resize: 'none' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={createMutation.isLoading}>
                            <Megaphone size={20} />
                            {createMutation.isLoading ? 'Publishing...' : 'Publish Now'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {isLoading ? (
                    <p>Loading announcements...</p>
                ) : announcements?.length === 0 ? (
                    <p>No announcements found.</p>
                ) : announcements.map(ann => (
                    <div key={ann.id} className="glass" style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderLeft: ann.importance === 'high' ? '4px solid #ef4444' : '4px solid var(--primary)'
                    }}>
                        <div style={{ flex: 1, marginRight: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{ann.title}</h3>
                                {ann.importance === 'high' && <AlertCircle size={16} color="#ef4444" />}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                                <Calendar size={14} /> {new Date(ann.published_at).toLocaleDateString()}
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{ann.content}</p>
                        </div>
                        <button
                            onClick={() => { if (window.confirm('Delete this announcement?')) deleteMutation.mutate(ann.id) }}
                            style={{ color: '#ef4444', background: 'none' }}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageAnnouncements;
