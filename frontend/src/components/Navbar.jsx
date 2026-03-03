import { Link } from 'react-router-dom';
import { Church, Calendar, Music, Image as ImageIcon, Info, User } from 'lucide-react';

const Navbar = () => {
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
                    <span>CEP UR-CE <span style={{ color: 'var(--gray-900)' }}>Rukara</span></span>
                </Link>

                <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <li>
                        <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <Calendar size={18} /> Events
                        </Link>
                    </li>
                    <li>
                        <Link to="/choirs" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <Music size={18} /> Choirs
                        </Link>
                    </li>
                    <li>
                        <Link to="/gallery" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <ImageIcon size={18} /> Gallery
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <Info size={18} /> About
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                            <User size={18} /> Login
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
