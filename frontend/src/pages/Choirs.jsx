import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Music, Users, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_BASE from '../api';

const Choirs = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: choirs, isLoading, error } = useQuery({
        queryKey: ['choirs'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE}/api/choirs`);
            return response.data;
        }
    });

    const [search, setSearch] = useState('');

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('admin.common.loading')}</div>;
    if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>{t('choirs.error')}</div>;

    const items = (choirs || []).filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="choirs-page" style={{
            padding: '4rem 0',
            background: 'linear-gradient(to bottom, var(--background), var(--secondary))',
            minHeight: '100vh',
            transition: 'var(--transition)'
        }}>
            <div className="container">
                <div style={{ marginBottom: '3rem', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search choirs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.85rem 3rem',
                            borderRadius: '50px',
                            border: '1px solid var(--border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    />
                </div>

                {items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>{t('choirs.no_choirs')}</p>
                ) : (
                    <div className="choirs-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '1rem'
                    }}>
                        {items.map((choir) => (
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
                                            src={choir.thumbnail_url.startsWith('http') ? choir.thumbnail_url : `${API_BASE}${choir.thumbnail_url}`}
                                            alt={choir.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Music size={60} color="var(--primary)" />
                                    )}
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{choir.name}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>{choir.description}</p>

                                <button 
                                    onClick={() => navigate(`/gallery?choirId=${choir.id}`)}
                                    className="btn-primary" 
                                    style={{ padding: '0.75rem 2rem', width: '100%', justifyContent: 'center' }}
                                >
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
