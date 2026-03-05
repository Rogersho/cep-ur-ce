import { Link, useNavigate } from 'react-router-dom';
import { Church, Calendar, Music, Image as ImageIcon, Info, User, Languages, Sun, Moon, LogOut, LayoutDashboard, Megaphone, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            padding: '0.75rem 0',
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

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`} style={{
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none'
                }}>
                    <NavLink to="/events" icon={<Calendar size={18} />} label={t('nav.events')} onClick={() => setIsMenuOpen(false)} />
                    <NavLink to="/choirs" icon={<Music size={18} />} label={t('nav.choirs')} onClick={() => setIsMenuOpen(false)} />
                    <NavLink to="/gallery" icon={<ImageIcon size={18} />} label={t('nav.gallery')} onClick={() => setIsMenuOpen(false)} />
                    <NavLink to="/announcements" icon={<Megaphone size={18} />} label={t('nav.news')} onClick={() => setIsMenuOpen(false)} />
                    <NavLink to="/about" icon={<Info size={18} />} label={t('nav.about')} onClick={() => setIsMenuOpen(false)} />

                    <div className="nav-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button onClick={toggleTheme} className="theme-toggle glass" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', border: 'none' }} title={`Theme: ${theme}`}>
                            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> :
                                (window.matchMedia('(prefers-color-scheme: dark)').matches ? <Moon size={18} opacity={0.5} /> : <Sun size={18} opacity={0.5} />)}
                        </button>

                        <div className="lang-switcher" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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

                    <div className="nav-auth" style={{ marginLeft: '0.5rem' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {user.role === 'admin' && (
                                    <Link to="/admin" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }} onClick={() => setIsMenuOpen(false)}>
                                        <LayoutDashboard size={18} /> {t('admin.nav.management')}
                                    </Link>
                                )}
                                <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{user.username}</span>
                                    <button onClick={handleLogout} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', fontSize: '1.25rem' }}>
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => setIsMenuOpen(false)}>
                                <User size={18} /> {t('nav.login')}
                            </Link>
                        )}
                    </div>
                </ul>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .mobile-toggle {
                        display: block !important;
                    }
                    .nav-links {
                        display: none !important;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--white);
                        flex-direction: column;
                        padding: 2rem;
                        gap: 1.5rem !important;
                        border-top: 1px solid var(--border);
                        box-shadow: var(--shadow-lg);
                        align-items: flex-start !important;
                    }
                    .nav-links.open {
                        display: flex !important;
                    }
                    .nav-controls, .nav-auth {
                        margin-left: 0 !important;
                        width: 100%;
                        padding-top: 1rem;
                        border-top: 1px solid var(--border);
                        justify-content: space-between;
                    }
                    .user-profile {
                        border-left: none !important;
                        padding-left: 0 !important;
                    }
                }
            `}</style>
        </nav>
    );
};

const NavLink = ({ to, icon, label, onClick }) => (
    <li style={{ width: '100%' }}>
        <Link to={to} onClick={onClick} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500,
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            padding: '0.5rem 0'
        }}>
            {icon} {label}
        </Link>
    </li>
);

export default Navbar;
