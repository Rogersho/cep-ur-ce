import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Megaphone, Calendar, AlertCircle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_BASE from '../api';

const Announcements = () => {
    const { t } = useTranslation();
    const { data: announcements, isLoading, error } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE}/api/announcements`);
            return response.data;
        }
    });

    const [search, setSearch] = useState('');

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('admin.common.loading')}</div>;

    const items = (announcements || []).filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="announcements-page" style={{
            padding: '4rem 0',
            background: 'linear-gradient(to bottom, var(--background), var(--secondary))',
            minHeight: '100vh',
            transition: 'var(--transition)'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '3rem', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 3rem',
                            borderRadius: '50px',
                            border: '1px solid var(--border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.3s'
                        }}
                    />
                </div>

                {items.length === 0 ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: 'var(--radius)' }}>
                        <Megaphone size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>{t('announcements.no_announcements')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem' }}>
                        {items.map((item) => (
                            <div key={item.id} className="glass" style={{
                                padding: '2.5rem',
                                borderRadius: 'var(--radius)',
                                borderLeft: item.importance === 'high' ? '6px solid #ef4444' : '6px solid var(--primary)',
                                transition: 'all 0.3s ease',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div className="announcement-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {item.importance === 'high' && <AlertCircle size={24} color="#ef4444" />}
                                        {item.title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                                        <Calendar size={16} />
                                        {new Date(item.published_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-main)', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1.05rem', opacity: 0.9 }}>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .announcements-page .glass:hover {
                    transform: translateX(10px);
                    box-shadow: var(--shadow-md);
                    border-left-width: 10px;
                }
            `}</style>
        </div>
    );
};

export default Announcements;
