import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, MapPin, Clock, Share2, Download, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

const Events = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [sharingId, setSharingId] = useState(null);
    const cardRefs = useRef({});

    const { data: events, isLoading, error } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/events');
            return response.data;
        }
    });

    const handleShareImage = async (event) => {
        const cardElement = cardRefs.current[event.id];
        if (!cardElement) return;

        setSharingId(event.id);
        addToast(t('events.generating'), 'info');

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(cardElement, {
                cacheBust: true,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    width: cardElement.offsetWidth + 'px',
                    height: cardElement.offsetHeight + 'px'
                }
            });

            download(dataUrl, `CEP-Event-${event.title.replace(/\s+/g, '-')}.png`);
            addToast(t('events.downloaded'), 'success');
        } catch (err) {
            console.error('Failed to generate image:', err);
            addToast(t('events.failed'), 'error');
        } finally {
            setSharingId(null);
        }
    };

    const handleShareText = async (event) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: event.title,
                    text: `${event.title}\n📅 ${new Date(event.event_date).toLocaleDateString()}\n📍 ${event.location}\n\n${event.description}`,
                    url: window.location.href,
                });
            } else {
                const shareText = `${event.title}\n📅 ${new Date(event.event_date).toLocaleDateString()}\n📍 ${event.location}\n\n${event.description}`;
                await navigator.clipboard.writeText(shareText);
                addToast(t('events.copied'), 'info');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('events.loading')}</div>;
    if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>{t('events.error')}</div>;

    return (
        <div className="events-page" style={{ padding: '4rem 0', background: 'linear-gradient(to bottom, var(--background), var(--secondary))', minHeight: '100vh', transition: 'var(--transition)' }}>
            <div className="container">
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="section-title"
                        style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-main)' }}
                    >
                        {t('events.title')} <span style={{ color: 'var(--primary)', position: 'relative' }}>
                            {t('events.span')}
                            <span style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '4px', background: 'var(--primary)', borderRadius: '2px', opacity: 0.3 }}></span>
                        </span>
                    </motion.h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        {t('events.subtitle')}
                    </p>
                </header>

                {events.length === 0 ? (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius)' }}>
                        <Calendar size={64} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: '1.5rem' }} />
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{t('events.no_events')}</p>
                    </div>
                ) : (
                    <div className="events-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2rem'
                    }}>
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                ref={el => cardRefs.current[event.id] = el}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="event-card"
                                style={{
                                    height: '380px',
                                    borderRadius: '30px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                    background: 'var(--white)',
                                    border: '1px solid var(--border)'
                                }}
                            >
                                {/* Background Image */}
                                <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                                    {event.image_url ? (
                                        <img
                                            src={`http://localhost:5000${event.image_url}`}
                                            alt={event.title}
                                            crossOrigin="anonymous"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                            className="zoom-image"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar size={80} color="white" style={{ opacity: 0.3 }} />
                                        </div>
                                    )}
                                    {/* Gradient Overlay - Darker at bottom for text readability */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
                                    }}></div>
                                </div>

                                {/* Content Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    padding: '1.5rem',
                                    color: 'white',
                                    zIndex: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    height: '100%'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        {event.category && (
                                            <span style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(12px)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '12px',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}>
                                                {event.category}
                                            </span>
                                        )}
                                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShareImage(event); }}
                                                className="btn-share hover-scale"
                                                disabled={sharingId === event.id}
                                                style={{
                                                    background: 'rgba(255,255,255,0.15)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                title={t('events.share_image')}
                                            >
                                                {sharingId === event.id ? <Clock size={16} className="spin" /> : <Download size={18} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShareText(event); }}
                                                className="hover-scale"
                                                style={{
                                                    background: 'rgba(255,255,255,0.15)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                title={t('events.share_links')}
                                            >
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>{event.title}</h3>

                                    <div className="description-container" style={{
                                        maxHeight: '60px',
                                        overflow: 'hidden',
                                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                                        marginBottom: '1rem',
                                        fontSize: '0.85rem',
                                        opacity: 0.85,
                                        lineHeight: 1.5
                                    }}>
                                        {event.description}
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                                            <Calendar size={14} color="var(--primary)" />
                                            <span>
                                                {new Date(event.event_date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })} • {new Date(event.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                                            <MapPin size={14} color="#f43f5e" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>CEP RUKARA</div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .event-card:hover .zoom-image {
                    transform: scale(1.08);
                }
                .hover-scale:hover {
                    background: rgba(var(--primary-rgb), 0.2) !important;
                    transform: translateY(-3px);
                    border-color: var(--primary) !important;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .events-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .section-title {
                        font-size: 2.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Events;
