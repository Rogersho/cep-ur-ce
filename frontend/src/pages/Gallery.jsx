import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

const Gallery = () => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);

    const { data: gallery, isLoading, error } = useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/gallery');
            return response.data;
        },
        retry: false
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('gallery.loading')}</div>;

    const items = gallery || [];

    return (
        <div className="gallery-page" style={{
            padding: '4rem 0',
            background: 'linear-gradient(to bottom, var(--background), var(--secondary))',
            minHeight: '100vh',
            transition: 'var(--transition)'
        }}>
            <div className="container">
                <h1 className="section-title" style={{ color: 'var(--text-main)' }}>{t('gallery.title')} <span>{t('gallery.span')}</span></h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    {t('gallery.subtitle')}
                </p>

                {items.length === 0 ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: 'var(--radius)' }}>
                        <ImageIcon size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>{t('gallery.no_photos')}</p>
                    </div>
                ) : (
                    <div className="gallery-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="glass"
                                style={{
                                    borderRadius: 'var(--radius)',
                                    overflow: 'hidden',
                                    height: '280px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: 'var(--shadow)'
                                }}
                                onClick={() => setSelectedImage(item)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                                }}
                            >
                                <img
                                    src={`http://localhost:5000${item.image_path}`}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: '1.5rem',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease'
                                }}
                                    className="gallery-overlay"
                                >
                                    <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>{item.title}</h4>
                                </div>
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'white', opacity: 0.7 }}>
                                    <Maximize2 size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Lightbox */}
                {selectedImage && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.95)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            animation: 'fadeIn 0.3s ease-out'
                        }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                            <img
                                src={`http://localhost:5000${selectedImage.image_path}`}
                                alt={selectedImage.title}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '-3rem',
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedImage.title}</h3>
                            </div>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '-1rem',
                                    right: '-1rem',
                                    color: 'white',
                                    background: 'var(--primary)',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                                onClick={() => setSelectedImage(null)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .gallery-grid div:hover .gallery-overlay {
                    opacity: 1 !important;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Gallery;
