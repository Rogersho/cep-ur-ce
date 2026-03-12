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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {sections.map((section, index) => {
                            const title = section[`title_${currentLang}`] || section.title_en;
                            const content = section[`content_${currentLang}`] || section.content_en;
                            const isEven = index % 2 === 0;

                            return (
                                <div 
                                    key={section.id} 
                                    className="glass" 
                                    style={{ 
                                        padding: '3rem', 
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        flexDirection: isEven ? 'row' : 'row-reverse',
                                        alignItems: 'center',
                                        gap: '4rem',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {section.image_url && (
                                        <div style={{ flex: '1 1 400px', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', height: '400px' }}>
                                            <img 
                                                src={optimizeCloudinaryUrl(section.image_url, { width: 800, height: 800 })} 
                                                alt={title} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div style={{ flex: '1 1 400px' }}>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                            {title}
                                        </h2>
                                        <div style={{ 
                                            fontSize: '1.1rem', 
                                            lineHeight: 1.8, 
                                            color: 'var(--text-muted)',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default About;
