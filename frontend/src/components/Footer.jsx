import { Link } from 'react-router-dom';
import { Church, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer style={{
            backgroundColor: 'var(--white)',
            borderTop: '1px solid var(--border)',
            padding: '4rem 0 2rem',
            marginTop: '4rem',
            transition: 'var(--transition)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Church size={32} />
                            <span>CEP UR-CE <span style={{ color: 'var(--text-main)' }}>Rukara</span></span>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                            {t('hero.subtitle')}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <SocialIcon icon={<Facebook size={20} />} href="#" />
                            <SocialIcon icon={<Twitter size={20} />} href="#" />
                            <SocialIcon icon={<Instagram size={20} />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 700 }}>{t('nav.about')}</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <FooterLink to="/" label="Home" />
                            <FooterLink to="/events" label={t('nav.events')} />
                            <FooterLink to="/choirs" label={t('nav.choirs')} />
                            <FooterLink to="/about" label={t('nav.about')} />
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 700 }}>Community</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <FooterLink to="/gallery" label={t('nav.gallery')} />
                            <FooterLink to="/announcements" label="Announcements" />
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 700 }}>Contact Us</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <MapPin size={18} color="var(--primary)" />
                                UR-CE Rukara Campus, Kayonza District, Rwanda
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Phone size={18} color="var(--primary)" />
                                +250 788 123 456
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Mail size={18} color="var(--primary)" />
                                info.ce@ur.ac.rw
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                }}>
                    <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} CEP UR-CE Rukara Campus. All rights reserved.</p>

                    {/* Logo icon linking to admin login — hidden in plain sight */}
                    <Link
                        to="/login"
                        title="Admin Login"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.45,
                            transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.opacity = '0.45'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        <img
                            src="/cep_logo.jpeg"
                            alt="CEP"
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                        />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, label }) => (
    <li>
        <Link to={to} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
            {label}
        </Link>
    </li>
);

const SocialIcon = ({ icon, href }) => (
    <a href={href} style={{
        backgroundColor: 'var(--gray-100)',
        color: 'var(--primary)',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    }} onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--primary)'; e.target.style.color = 'white'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'var(--gray-100)'; e.target.style.color = 'var(--primary)'; }}>
        {icon}
    </a>
);

export default Footer;
