import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import API_BASE from '../api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { Info, History, Users, Target } from 'lucide-react';

const About = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';

    const { data: sections, isLoading } = useQuery({
        queryKey: ['about-sections'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/about`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>{t('about.loading') || 'Loading about us...'}</p>
        </div>
    );

    return (
        <div className="about-page" style={{ paddingBottom: '5rem' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                padding: '10rem 2rem 14rem',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                        {t('nav.about')}
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
                        {t('about.subtitle') || 'Discover our story, mission, and the community that makes CEP UR-CE special.'}
                    </p>
                </div>
                
                {/* Decorative shapes */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
            </div>

            {/* Dynamic Sections */}
            <div style={{ maxWidth: '1100px', margin: '-8rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
                {sections?.length === 0 ? (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius)' }}>
                        <Info size={48} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>{t('about.no_content') || 'No content has been added yet.'}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                        {sections.map((section, index) => {
                            // Logic: If current language is available, use it. 
                            // If user is in FR (or others) and it's missing, use EN as base.
                            const title = section[`title_${currentLang}`] || section.title_en;
                            const content = section[`content_${currentLang}`] || section.content_en;
                            const isEven = index % 2 === 0;

                            return (
                                <section 
                                    key={section.id} 
                                    style={{ 
                                        display: 'flex',
                                        flexDirection: isEven ? 'row' : 'row-reverse',
                                        alignItems: 'center',
                                        gap: '5rem',
                                        flexWrap: 'wrap',
                                        margin: '2rem 0'
                                    }}
                                >
                                    {section.image_url && (
                                        <div style={{ 
                                            flex: '1 1 450px', 
                                            borderRadius: '30px', 
                                            overflow: 'hidden', 
                                            boxShadow: 'var(--shadow-xl)', 
                                            height: '500px',
                                            border: '1px solid var(--border)'
                                        }}>
                                            <img 
                                                src={optimizeCloudinaryUrl(section.image_url, { width: 1000, height: 1000 })} 
                                                alt={title} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                className="img-zoom"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div style={{ flex: '1 1 450px', padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '50px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                                                {isEven ? 'Section' : 'Focus'} {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-main)', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                                            {title}
                                        </h2>
                                        <div style={{ 
                                            fontSize: '1.15rem', 
                                            lineHeight: 1.9, 
                                            color: 'var(--text-muted)',
                                            whiteSpace: 'pre-wrap',
                                            textAlign: 'justify'
                                        }}>
                                            {content}
                                        </div>
                                        {!section[`content_${currentLang}`] && currentLang !== 'en' && (
                                            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Info size={14} /> (Available in English)
                                            </p>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default About;
