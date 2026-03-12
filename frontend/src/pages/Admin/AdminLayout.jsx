import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Music,
    Image as ImageIcon,
    Megaphone,
    LogOut,
    ArrowLeft,
    Menu,
    X,
    Sun,
    Moon,
    Languages,
    FolderOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    let navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: t('admin.nav.overview') },
        { path: '/admin/events', icon: <Calendar size={20} />, label: t('admin.nav.events') },
        { path: '/admin/choirs', icon: <Music size={20} />, label: t('admin.nav.choirs') },
        { path: '/admin/albums', icon: <FolderOpen size={20} />, label: 'Albums' },
        { path: '/admin/gallery', icon: <ImageIcon size={20} />, label: t('admin.nav.gallery') },
        { path: '/admin/announcements', icon: <Megaphone size={20} />, label: t('admin.nav.news') },
        { path: '/admin/about', icon: <Info size={20} />, label: t('admin.nav.about') },
    ];


    return (
        <div className="admin-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            {/* Sidebar toggle for mobile */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    zIndex: 1100,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'none', // Shown via media query
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)'
                }}
                className="mobile-sidebar-toggle"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar glass ${isSidebarOpen ? 'open' : 'closed'}`} style={{
                width: '280px',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
                borderRight: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                height: '100vh',
                transition: 'transform 0.3s ease',
                zIndex: 1000
            }}>
                <div style={{ padding: '0 1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LayoutDashboard size={28} />
                        {t('admin.title')}
                    </h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-muted)',
                                background: location.pathname === item.path ? 'var(--secondary)' : 'transparent',
                                fontWeight: 600,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
                    {/* Language Switcher in Sidebar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                        <Languages size={20} color="var(--primary)" />
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            value={i18n.language}
                            style={{
                                flex: 1,
                                background: 'var(--secondary)',
                                border: 'none',
                                color: 'var(--text-main)',
                                fontWeight: 600,
                                padding: '0.5rem',
                                borderRadius: '8px',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="rw">Kinyarwanda</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>

                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '12px',
                            background: 'var(--secondary)',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </button>

                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'var(--text-main)',
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={20} />
                        {t('admin.nav.return')}
                    </Link>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ef4444',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={20} />
                        {t('admin.nav.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content" style={{
                flex: 1,
                padding: '2.5rem',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                background: 'var(--admin-gradient)',
                minHeight: '100vh'
            }}>
                <Outlet />
            </main>

            <style>{`
                .admin-nav-item:hover {
                    background: var(--secondary) !important;
                    color: var(--primary) !important;
                }
                
                @media (max-width: 1024px) {
                    .admin-sidebar {
                        position: fixed !important;
                        height: 100vh;
                        box-shadow: var(--shadow-xl);
                    }
                    .admin-sidebar.closed {
                        transform: translateX(-100%);
                    }
                    .mobile-sidebar-toggle {
                        display: flex !important;
                    }
                }
                
                @media (max-width: 640px) {
                    .admin-content {
                        padding: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
