import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Users, X, CheckCircle, Save } from 'lucide-react';

const ManageMinistries = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        leader_name: '',
        contact_info: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const { data: ministries, isLoading } = useQuery({
        queryKey: ['admin-ministries'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/ministries');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newMinistry) => {
            const token = localStorage.getItem('token');
            return axios.post('http://localhost:5000/api/ministries', newMinistry, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-ministries']);
            setMessage({ text: 'Ministry added successfully!', type: 'success' });
            setShowForm(false);
            setFormData({ name: '', description: '', leader_name: '', contact_info: '' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`http://localhost:5000/api/ministries/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-ministries']);
            setMessage({ text: 'Ministry deleted successfully!', type: 'success' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>Ministries</span></h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add Ministry'}
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Ministry Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Leader Name</label>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contact Info (Email/Phone)</label>
                            <input
                                type="text"
                                required
                                value={formData.contact_info}
                                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', resize: 'none' }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={createMutation.isLoading}>
                            <Save size={20} />
                            {createMutation.isLoading ? 'Saving...' : 'Add Ministry'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {isLoading ? (
                    <p>Loading ministries...</p>
                ) : ministries?.length === 0 ? (
                    <p>No ministries found.</p>
                ) : ministries.map(min => (
                    <div key={min.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{min.name}</h3>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Leader: <span style={{ fontWeight: 600 }}>{min.leader_name}</span></p>
                        </div>
                        <button
                            onClick={() => { if (window.confirm('Delete this ministry?')) deleteMutation.mutate(min.id) }}
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

export default ManageMinistries;
