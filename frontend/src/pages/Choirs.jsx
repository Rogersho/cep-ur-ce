import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Music, Users } from 'lucide-react';

const Choirs = () => {
    const { data: choirs, isLoading, error } = useQuery({
        queryKey: ['choirs'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/choirs');
            return response.data;
        }
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading choirs...</div>;
    if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>Error loading choirs.</div>;

    return (
        <div className="choirs-page" style={{ padding: '4rem 0' }}>
            <div className="container">
                <h1 className="section-title">Our <span>Choirs</span></h1>

                {choirs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>No choirs registered yet.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {choirs.map((choir) => (
                            <div key={choir.id} className="glass" style={{
                                borderRadius: 'var(--radius)',
                                padding: '2rem',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease'
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--secondary)',
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    {choir.thumbnail_url ? (
                                        <img
                                            src={`http://localhost:5000${choir.thumbnail_url}`}
                                            alt={choir.name}
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Music size={40} color="var(--primary)" />
                                    )}
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>{choir.name}</h3>
                                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{choir.description}</p>

                                <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                                    <Users size={18} /> View Gallery
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Choirs;
