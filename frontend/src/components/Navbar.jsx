import { Link } from 'react-router-dom';
import { Church, Calendar, Music, Image as ImageIcon, Info, User, Languages, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme'); // Auto/System
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

                <ul style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <li>
                        <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <Calendar size={18} /> {t('nav.events')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/choirs" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <Music size={18} /> {t('nav.choirs')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/gallery" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <ImageIcon size={18} /> {t('nav.gallery')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <Info size={18} /> {t('nav.about')}
                        </Link>
                    </li>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="glass" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }} title={`Theme: ${theme}`}>
                            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> :
                                (window.matchMedia('(prefers-color-scheme: dark)').matches ? <Moon size={18} opacity={0.5} /> : <Sun size={18} opacity={0.5} />)}
                        </button>

                        {/* Language Switcher */}
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
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="en">EN</option>
                                <option value="rw">RW</option>
                                <option value="fr">FR</option>
                            </select>
                        </div>
                    </div>

                    <li>
                        <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                            <User size={18} /> {t('nav.login')}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
