import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%)',
                padding: '6rem 0',
                textAlign: 'center',
                transition: 'var(--transition)'
            }}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}
                    >
                        {t('hero.welcome')} <span style={{ color: 'var(--primary)' }}>CEP UR-CE</span> <br /> {t('hero.rukara')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}
                    >
                        {t('hero.subtitle')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
                    >
                        <Link to="/events" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            {t('hero.view_events')} <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="glass" style={{
                            padding: '1rem 2rem',
                            borderRadius: 'var(--radius)',
                            fontWeight: 500,
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {t('hero.learn_more')}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <h2 className="section-title" style={{ color: 'var(--text-main)' }}>{t('features.title')}</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <FeatureCard
                            icon={<Calendar size={32} color="var(--primary)" />}
                            title={t('features.events.title')}
                            description={t('features.events.desc')}
                        />
                        <FeatureCard
                            icon={<Users size={32} color="var(--primary)" />}
                            title={t('features.choirs.title')}
                            description={t('features.choirs.desc')}
                        />
                        <FeatureCard
                            icon={<Megaphone size={32} color="var(--primary)" />}
                            title={t('features.announcements.title')}
                            description={t('features.announcements.desc')}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="glass" style={{
        padding: '2rem',
        borderRadius: 'var(--radius)',
        transition: 'var(--transition)',
        textAlign: 'center'
    }}>
        <div style={{
            backgroundColor: 'var(--secondary)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            transition: 'var(--transition)'
        }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
);

export default Home;
