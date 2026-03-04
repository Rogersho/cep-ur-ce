import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, Mail, Phone, Info } from 'lucide-react';

const Ministries = () => {
    const { data: ministries, isLoading, error } = useQuery({
        queryKey: ['ministries'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/ministries');
            return response.data;
        }
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading ministries...</div>;

    const items = ministries || [];

    return (
        <div className="ministries-page" style={{ padding: '4rem 0' }}>
            <div className="container">
                <h1 className="section-title">Our <span>Ministries</span></h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                    Each ministry plays a vital role in our church community, serving together to fulfill our mission and support one another in faith.
                </p>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                        <Users size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No ministry information available yet.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2rem'
                    }}>
                        {items.map((ministry) => (
                            <div key={ministry.id} className="glass" style={{
                                padding: '2rem',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--secondary)',
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <Users size={32} color="var(--primary)" />
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>{ministry.name}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>{ministry.description}</p>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <Info size={16} color="var(--primary)" />
                                        Leader: {ministry.leader_name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Mail size={16} color="var(--primary)" />
                                        {ministry.contact_info}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ministries;
