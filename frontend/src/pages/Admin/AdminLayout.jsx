import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Music, Image as ImageIcon, Megaphone, Users, LogOut, Home } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            {/* Sidebar */}
            <aside className="glass" style={{
                width: '260px',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1001
            }}>
                <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                        <LayoutDashboard size={24} />
                        <span>CEP ADMIN</span>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <AdminNavLink to="/admin" end icon={<LayoutDashboard size={20} />} label="Overview" />
                    <AdminNavLink to="/admin/events" icon={<Calendar size={20} />} label="Manage Events" />
                    <AdminNavLink to="/admin/choirs" icon={<Music size={20} />} label="Manage Choirs" />
                    <AdminNavLink to="/admin/gallery" icon={<ImageIcon size={20} />} label="Manage Gallery" />
                    <AdminNavLink to="/admin/announcements" icon={<Megaphone size={20} />} label="Manage News" />
                    <AdminNavLink to="/admin/ministries" icon={<Users size={20} />} label="Manage Ministries" />

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <AdminNavLink to="/" icon={<Home size={20} />} label="Return to Site" />
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                color: '#ef4444',
                                background: 'none',
                                fontWeight: 500,
                                textAlign: 'left',
                                transition: 'var(--transition)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const AdminNavLink = ({ to, icon, label, end = false }) => (
    <NavLink
        to={to}
        end={end}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            color: isActive ? 'white' : 'var(--text-main)',
            backgroundColor: isActive ? 'var(--primary)' : 'transparent',
            fontWeight: 500,
            transition: 'var(--transition)'
        })}
    >
        {icon} {label}
    </NavLink>
);

export default AdminLayout;
