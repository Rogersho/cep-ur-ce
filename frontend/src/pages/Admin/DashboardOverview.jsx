import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, Calendar, Music, Image as ImageIcon, Megaphone, TrendingUp } from 'lucide-react';

const DashboardOverview = () => {
    // In a real app, we'd have a single stats endpoint. 
    // For now, we'll fetch all counts individually or use dummy data if endpoints aren't specialized for counts.
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // Mocking some stats for now or fetching from existing listing APIs
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
                users: 124 // Placeholder for user count
            };
        }
    });

    if (isLoading) return <div>Loading statistics...</div>;

    return (
        <div>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Admin <span style={{ color: 'var(--primary)' }}>Overview</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Monitor and manage the CEP UR-CE platform content.</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatCard icon={<Calendar size={24} />} title="Total Events" value={stats?.events} color="#0ea5e9" />
                <StatCard icon={<Music size={24} />} title="Active Choirs" value={stats?.choirs} color="#8b5cf6" />
                <StatCard icon={<ImageIcon size={24} />} title="Gallery Items" value={stats?.gallery} color="#ec4899" />
                <StatCard icon={<Megaphone size={24} />} title="Announcements" value={stats?.announcements} color="#f59e0b" />
                <StatCard icon={<Users size={24} />} title="Registered Members" value={stats?.users} color="#10b981" />
            </div>

            {/* Quick Actions or Recent Activity Section */}
            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Platform Activity</h2>
                <div className="glass" style={{
                    padding: '2rem',
                    borderRadius: 'var(--radius)',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                }}>
                    <TrendingUp size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Coming soon: Detailed activity logs and platform analytics charts.</p>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="glass" style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</h3>
        </div>
    </div>
);

export default DashboardOverview;
