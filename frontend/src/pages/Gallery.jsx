import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const { data: gallery, isLoading, error } = useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            // This endpoint will return all gallery items (choir-specific or general)
            // For now, we'll fetch from a generic gallery endpoint if implemented, 
            // or mock it if the backend needs more logic.
            // Let's assume the backend has a general gallery fetch.
            const response = await axios.get('http://localhost:5000/api/gallery');
            return response.data;
        },
        retry: false
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading gallery...</div>;

    // Handle case where gallery endpoint might not be fully ready or empty
    const items = gallery || [];

    return (
        <div className="gallery-page" style={{ padding: '4rem 0' }}>
            <div className="container">
                <h1 className="section-title">Community <span>Gallery</span></h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    Explore beautiful moments from our worship services, choir performances, and community gatherings.
                </p>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                        <ImageIcon size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No photos have been uploaded to the gallery yet.</p>
                    </div>
                ) : (
                    <div style={{
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
                                    height: '250px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease'
                                }}
                                onClick={() => setSelectedImage(item)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img
                                    src={`http://localhost:5000${item.image_path}`}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: '1rem',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                                >
                                    <h4 style={{ color: 'white', fontSize: '1rem' }}>{item.title}</h4>
                                </div>
                                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'white' }}>
                                    <Maximize2 size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Simple Lightbox (Modal) */}
                {selectedImage && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                            <img
                                src={`http://localhost:5000${selectedImage.image_path}`}
                                alt={selectedImage.title}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                            />
                            <h3 style={{ color: 'white', textAlign: 'center', marginTop: '1rem' }}>{selectedImage.title}</h3>
                            <button
                                style={{ position: 'absolute', top: '-2rem', right: '-2rem', color: 'white', background: 'none', fontSize: '2rem' }}
                                onClick={() => setSelectedImage(null)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
