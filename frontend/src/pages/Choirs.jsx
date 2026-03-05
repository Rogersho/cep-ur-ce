import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Music, Users } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Choirs = () => {
    const { t } = useTranslation();
    const { data: choirs, isLoading, error } = useQuery({
        queryKey: ['choirs'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/choirs');
            return response.data;
        }
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('choirs.loading')}</div>;
    if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>{t('choirs.error')}</div>;

    return (
        <div className="choirs-page" style={{
            padding: '4rem 0',
            background: 'linear-gradient(to bottom, var(--background), var(--secondary))',
            minHeight: '100vh',
            transition: 'var(--transition)'
        }}>
            <div className="container">
                <h1 className="section-title" style={{ color: 'var(--text-main)' }}>{t('choirs.title')} <span>{t('choirs.span')}</span></h1>

                {choirs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('choirs.no_choirs')}</p>
                ) : (
                    <div className="choirs-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '3rem'
                    }}>
                        {choirs.map((choir) => (
                            <div key={choir.id} className="glass" style={{
                                borderRadius: 'var(--radius)',
                                padding: '3rem 2rem',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--secondary)',
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    border: '4px solid var(--white)',
                                    boxShadow: 'var(--shadow)',
                                    overflow: 'hidden'
                                }}>
                                    {choir.thumbnail_url ? (
                                        <img
                                            src={`http://localhost:5000${choir.thumbnail_url}`}
                                            alt={choir.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Music size={60} color="var(--primary)" />
                                    )}
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{choir.name}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>{choir.description}</p>

                                <button className="btn-primary" style={{ padding: '0.75rem 2rem', width: '100%', justifyContent: 'center' }}>
                                    <Users size={20} /> {t('choirs.view_gallery')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .choirs-page .glass:hover {
                    transform: translateY(-10px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default Choirs;
