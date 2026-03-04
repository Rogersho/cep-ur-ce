import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Calendar, MapPin, Clock, Image as ImageIcon, X, CheckCircle } from 'lucide-react';

const ManageEvents = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Service'
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch Events
    const { data: events, isLoading } = useQuery({
        queryKey: ['admin-events'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/events');
            return res.data;
        }
    });

    // Create Event Mutation
    const createMutation = useMutation({
        mutationFn: async (newEvent) => {
            const token = localStorage.getItem('token');
            const data = new FormData();
            Object.keys(newEvent).forEach(key => data.append(key, newEvent[key]));
            if (image) data.append('image', image);

            return axios.post('http://localhost:5000/api/events', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            setMessage({ text: 'Event created successfully!', type: 'success' });
            setShowForm(false);
            resetForm();
        },
        onError: (error) => {
            setMessage({ text: error.response?.data?.message || 'Error creating event', type: 'error' });
        }
    });

    // Delete Event Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`http://localhost:5000/api/events/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            setMessage({ text: 'Event deleted successfully!', type: 'success' });
        }
    });

    const resetForm = () => {
        setFormData({ title: '', description: '', date: '', location: '', category: 'Service' });
        setImage(null);
    };

    const handleFileUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Manage <span style={{ color: 'var(--primary)' }}>Events</span></h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add New Event'}
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
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>New Event Details</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Event Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)', resize: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Thumbnail Image</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={createMutation.isLoading}>
                                {createMutation.isLoading ? 'Creating...' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)', fontWeight: 700 }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Event</th>
                            <th style={{ padding: '1rem' }}>Details</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center' }}>Loading events...</td></tr>
                        ) : events?.length === 0 ? (
                            <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center' }}>No events found.</td></tr>
                        ) : events.map(event => (
                            <tr key={event.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={`http://localhost:5000${event.image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{event.title}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.location}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => { if (window.confirm('Delete this event?')) deleteMutation.mutate(event.id) }}
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
    );
};

export default ManageEvents;
