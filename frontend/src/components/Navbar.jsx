import { Link, useNavigate } from 'react-router-dom';
import { Church, Calendar, Music, Image as ImageIcon, Info, User, Languages, Sun, Moon, LogOut, LayoutDashboard, Megaphone, Users as UsersIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

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
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'auto';
            return 'light';
        });
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '1rem 0',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
                    <Church size={32} />
                    <span>CEP UR-CE <span style={{ color: 'var(--text-main)' }}>Rukara</span></span>
                </Link>

                <ul style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <NavLink to="/events" icon={<Calendar size={18} />} label={t('nav.events')} />
                    <NavLink to="/choirs" icon={<Music size={18} />} label={t('nav.choirs')} />
                    <NavLink to="/gallery" icon={<ImageIcon size={18} />} label={t('nav.gallery')} />
                    <NavLink to="/announcements" icon={<Megaphone size={18} />} label="News" />
                    <NavLink to="/ministries" icon={<UsersIcon size={18} />} label="Ministries" />
                    <NavLink to="/about" icon={<Info size={18} />} label={t('nav.about')} />

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                        <button onClick={toggleTheme} className="glass" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', border: 'none' }} title={`Theme: ${theme}`}>
                            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> :
                                (window.matchMedia('(prefers-color-scheme: dark)').matches ? <Moon size={18} opacity={0.5} /> : <Sun size={18} opacity={0.5} />)}
                        </button>

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Languages size={18} color="var(--primary)" />
                            <select
                                onChange={(e) => changeLanguage(e.target.value)}
                                value={i18n.language}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-main)',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    outline: 'none',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <option value="en">EN</option>
                                <option value="rw">RW</option>
                                <option value="fr">FR</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginLeft: '0.5rem' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {user.role === 'admin' && (
                                    <Link to="/admin" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                        <LayoutDashboard size={18} /> Admin
                                    </Link>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{user.username}</span>
                                    <button onClick={handleLogout} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', fontSize: '0.9rem' }}>
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                <User size={18} /> {t('nav.login')}
                            </Link>
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label }) => (
    <li>
        <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500, fontSize: '0.9rem' }}>
            {icon} {label}
        </Link>
    </li>
);

export default Navbar;
