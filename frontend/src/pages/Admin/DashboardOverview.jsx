import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, Calendar, Music, Image as ImageIcon, Megaphone, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DashboardOverview = () => {
    const { t } = useTranslation();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const [events, choirs, gallery, announcements] = await Promise.all([
                axios.get('http://localhost:5000/api/events'),
                axios.get('http://localhost:5000/api/choirs'),
                axios.get('http://localhost:5000/api/gallery'),
                axios.get('http://localhost:5000/api/announcements')
            ]);

            return {
                events: events.data.length,
                choirs: choirs.data.length,
                gallery: gallery.data.length,
                announcements: announcements.data.length,
                latestEvents: events.data.slice(0, 5)
            };
        }
    });

    if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('admin.dashboard.updating')}</div>;

    return (
        <div>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Admin <span style={{ color: 'var(--primary)' }}>{t('admin.dashboard.overview')}</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>{t('admin.dashboard.stats_subtitle')}</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatCard icon={<Calendar size={24} />} title={t('admin.dashboard.total_events')} value={stats?.events} color="#0ea5e9" delay={0.1} />
                <StatCard icon={<Music size={24} />} title={t('admin.dashboard.active_choirs')} value={stats?.choirs} color="#8b5cf6" delay={0.2} />
                <StatCard icon={<ImageIcon size={24} />} title={t('admin.dashboard.gallery_items')} value={stats?.gallery} color="#ec4899" delay={0.3} />
                <StatCard icon={<Megaphone size={24} />} title={t('admin.dashboard.announcements')} value={stats?.announcements} color="#f59e0b" delay={0.4} />
            </div>

            {/* Platform Activity Section */}
            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>{t('admin.dashboard.activity')}</h2>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                    {stats?.latestEvents?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats.latestEvents.map(event => (
                                <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{event.title}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('admin.dashboard.created')} {new Date(event.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: 'var(--secondary)', color: 'var(--primary)', borderRadius: '1rem', fontWeight: 600 }}>{t('nav.events')}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <TrendingUp size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>{t('admin.dashboard.no_activity')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, title, value, color, delay }) => (
    <div className="glass-card hover-scale" style={{
        padding: '1.75rem',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        borderLeft: `6px solid ${color}`,
        animation: `fadeInUp 0.6s ease-out ${delay}s both`
    }}>
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 10px 20px ${color}10`
        }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{value}</h3>
        </div>
        <style>{`
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
    </div>
);

export default DashboardOverview;
