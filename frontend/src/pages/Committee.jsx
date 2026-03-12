import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, User, Calendar } from 'lucide-react';
import API_BASE from '../api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { useState } from 'react';

const Committee = () => {
    const { t, i18n } = useTranslation();
    const [selectedYear, setSelectedYear] = useState('All');

    const { data: members, isLoading } = useQuery({
        queryKey: ['committee-members'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/committee`);
            return res.data;
        }
    });

    const years = ['All', ...new Set(members?.map(m => m.year_range))].sort().reverse();

    const filteredMembers = selectedYear === 'All' 
        ? members 
        : members?.filter(m => m.year_range === selectedYear);

    if (isLoading) return (
        <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{t('committee.loading')}</p>
        </div>
    );

    return (
        <div style={{ background: 'var(--background)', minHeight: '100vh', padding: '6rem 0' }}>
            <div className="container">
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
                        {t('committee.title')} <span className="text-gradient">{t('committee.span')}</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        {t('committee.subtitle')}
                    </p>
                </header>

                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <Calendar size={20} color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>{t('committee.year_select')}:</span>
                    <select 
                        className="glass-input" 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        style={{ width: 'auto', padding: '0.5rem 2rem' }}
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {!filteredMembers || filteredMembers.length === 0 ? (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius)' }}>
                        <User size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>{t('committee.no_members')}</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '2.5rem' 
                    }}>
                        {filteredMembers.map(member => (
                            <div key={member.id} className="glass card-hover" style={{ 
                                borderRadius: 'var(--radius-lg)', 
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ height: '350px', position: 'relative', background: 'var(--secondary)' }}>
                                    {member.image_url ? (
                                        <img 
                                            src={optimizeCloudinaryUrl(member.image_url, { width: 600, height: 700, crop: 'fill' })} 
                                            alt={member.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={80} style={{ opacity: 0.1 }} />
                                        </div>
                                    )}
                                    <div style={{ 
                                        position: 'absolute', 
                                        bottom: 0, 
                                        left: 0, 
                                        right: 0, 
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        padding: '2rem 1.5rem 1rem'
                                    }}>
                                        <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>{member.name}</h3>
                                        <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>{member.position}</p>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <p style={{ 
                                        fontSize: '0.9rem', 
                                        color: 'var(--text-muted)', 
                                        marginBottom: '1.5rem', 
                                        lineHeight: 1.6,
                                        minHeight: '3.2rem'
                                    }}>
                                        {member.bio}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {member.email && (
                                            <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', textDecoration: 'none' }}>
                                                <div className="glass" style={{ padding: '0.4rem', borderRadius: '8px', display: 'flex' }}><Mail size={16} /></div>
                                                {member.email}
                                            </a>
                                        )}
                                        {member.phone && (
                                            <a href={`tel:${member.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', textDecoration: 'none' }}>
                                                <div className="glass" style={{ padding: '0.4rem', borderRadius: '8px', display: 'flex' }}><Phone size={16} /></div>
                                                {member.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div style={{ 
                                    padding: '0.75rem 1.5rem', 
                                    borderTop: '1px solid var(--border)', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 700, 
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>CEP UR-CE</span>
                                    <span>{member.year_range}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Committee;
