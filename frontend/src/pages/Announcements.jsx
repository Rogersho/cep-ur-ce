import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Megaphone, Calendar, AlertCircle } from 'lucide-react';

const Announcements = () => {
    const { data: announcements, isLoading, error } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/announcements');
            return response.data;
        }
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading announcements...</div>;

    const items = announcements || [];

    return (
        <div className="announcements-page" style={{ padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 className="section-title">Latest <span>Announcements</span></h1>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                        <Megaphone size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No announcements at this time.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {items.map((item) => (
                            <div key={item.id} className="glass" style={{
                                padding: '2rem',
                                borderRadius: 'var(--radius)',
                                borderLeft: item.importance === 'high' ? '4px solid #ef4444' : '4px solid var(--primary)',
                                transition: 'transform 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        {item.importance === 'high' && <AlertCircle size={20} color="#ef4444" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />}
                                        {item.title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        {new Date(item.published_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
