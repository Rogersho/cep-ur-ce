import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, MapPin, Clock, Share2, Download, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import API_BASE from '../api';

const PAGE_SIZE = 9;

const Events = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [sharingId, setSharingId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [sortBy, setSortBy] = useState('posted_desc');
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeStatus, setActiveStatus] = useState('upcoming'); // all, upcoming, past
    const [page, setPage] = useState(1);
    const cardRefs = useRef({});
    const shareRefs = useRef({});

    const { data: events, isLoading, error } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE}/api/events`);
            return response.data;
        }
    });

    const handleShareImage = async (event) => {
        const cardElement = shareRefs.current[event.id];
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

    const sortedEvents = useMemo(() => {
        let list = [...(events || [])];
        if (search) list = list.filter(e => e.title?.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase()));
        if (activeCategory !== 'all') list = list.filter(e => e.category === activeCategory);
        
        const now = new Date();
        if (activeStatus === 'upcoming') {
            list = list.filter(e => new Date(e.event_date) >= now);
        } else if (activeStatus === 'past') {
            list = list.filter(e => new Date(e.event_date) < now);
        }

        list.sort((a, b) => {
            switch (sortBy) {
                case 'posted_desc': return new Date(b.created_at) - new Date(a.created_at);
                case 'posted_asc':  return new Date(a.created_at) - new Date(b.created_at);
                case 'date_asc':    return new Date(a.event_date) - new Date(b.event_date);
                case 'date_desc':   return new Date(b.event_date) - new Date(a.event_date);
                case 'title_asc':   return a.title.localeCompare(b.title);
                default:            return 0;
            }
        });
        return list;
    }, [events, search, activeCategory, sortBy]);

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('events.loading')}</div>;
    if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>{t('events.error')}</div>;

    // Derive unique categories from events
    const categories = ['all', ...Array.from(new Set((events || []).map(e => e.category).filter(Boolean)))];

    const totalPages = Math.max(1, Math.ceil(sortedEvents.length / PAGE_SIZE));
    const paginatedEvents = sortedEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const SORT_OPTIONS = [
        { key: 'posted_desc', label: '🕐 Newest First' },
        { key: 'posted_asc',  label: '🕐 Oldest First' },
        { key: 'date_asc',    label: '📅 Soonest Event' },
        { key: 'date_desc',   label: '📅 Latest Event' },
        { key: 'title_asc',   label: '🔤 A → Z' },
    ];

    const handleFilterChange = (val) => { setActiveCategory(val); setPage(1); };
    const handleSearch = (val) => { setSearch(val); setPage(1); };
    const handleSort = (val) => { setSortBy(val); setPage(1); };

    return (
        <div className="events-page" style={{ padding: '4rem 0', background: 'linear-gradient(to bottom, var(--background), var(--secondary))', minHeight: '100vh', transition: 'var(--transition)' }}>
            <div className="container">
                {/* ── Search + Category + Sort toolbar ── */}
                {(events || []).length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                        {/* Row 1: Search + result count */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 1.25rem', background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search events by title, location, description…"
                                    value={search}
                                    onChange={e => handleSearch(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 2rem 0.5rem 2.25rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none' }}
                                />
                                {search && (
                                    <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Row 2: Category pills + Sort pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', padding: '0.6rem 1.25rem', background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '0.25rem' }}>Category:</span>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => handleFilterChange(cat)} style={{ padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: activeCategory === cat ? 700 : 500, border: activeCategory === cat ? 'none' : '1px solid var(--border)', background: activeCategory === cat ? 'var(--primary)' : 'var(--background)', color: activeCategory === cat ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                                    {cat === 'all' ? 'All' : cat}
                                </button>
                            ))}
                            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }} />
                            
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '0.25rem' }}>Status:</span>
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'upcoming', label: 'Upcoming' },
                                { id: 'past', label: 'Past' }
                            ].map(status => (
                                <button key={status.id} onClick={() => { setActiveStatus(status.id); setPage(1); }} style={{ padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: activeStatus === status.id ? 700 : 500, border: activeStatus === status.id ? 'none' : '1px solid var(--border)', background: activeStatus === status.id ? 'var(--primary)' : 'var(--background)', color: activeStatus === status.id ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                                    {status.label}
                                </button>
                            ))}

                            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '0.25rem' }}>Sort:</span>
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.key} onClick={() => handleSort(opt.key)} style={{ padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: sortBy === opt.key ? 700 : 500, border: sortBy === opt.key ? 'none' : '1px solid var(--border)', background: sortBy === opt.key ? '#6366f1' : 'var(--background)', color: sortBy === opt.key ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {paginatedEvents.length === 0 ? (
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
                        {paginatedEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                ref={el => cardRefs.current[event.id] = el}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="event-card glass"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 'var(--radius)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid var(--border)',
                                    height: '100%'
                                }}
                            >
                                {/* Image Header (Top Half) */}
                                <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url.startsWith('http') ? event.image_url : `${API_BASE}${event.image_url}`}
                                            alt={event.title}
                                            crossOrigin="anonymous"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                            className="zoom-image"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar size={64} color="var(--primary)" style={{ opacity: 0.5 }} />
                                        </div>
                                    )}

                                    {/* Badge overlays */}
                                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        {event.category && (
                                            <span style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.5px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                {event.category}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>
                                        CEP RUKARA
                                    </div>
                                </div>

                                {/* Content Body (Bottom Half) */}
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                                        {event.title}
                                    </h3>

                                    {/* Date & Location */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <div style={{ padding: '0.4rem', background: 'var(--secondary)', borderRadius: '8px', color: 'var(--primary)' }}>
                                                <Calendar size={16} />
                                            </div>
                                            <span>
                                                {new Date(event.event_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} • {new Date(event.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <div style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
                                                <MapPin size={16} />
                                            </div>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Description — truncated with Read More */}
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)',
                                        lineHeight: 1.6,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        marginBottom: '0.5rem',
                                    }}>
                                        {event.description}
                                    </p>
                                    {event.description && event.description.length > 120 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                padding: '0 0 1rem 0',
                                                textDecoration: 'underline',
                                                textUnderlineOffset: '3px'
                                            }}
                                        >
                                            Read more →
                                        </button>
                                    )}

                                    {/* Actions Footer */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            {t('events.share_links')}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShareImage(event); }}
                                                className="btn-icon hover-scale"
                                                disabled={sharingId === event.id}
                                                style={{
                                                    background: 'var(--background)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-main)',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title={t('events.share_image')}
                                            >
                                                {sharingId === event.id ? <Clock size={16} className="spin" /> : <Download size={16} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShareText(event); }}
                                                className="btn-icon hover-scale"
                                                style={{
                                                    background: 'var(--primary)',
                                                    border: 'none',
                                                    color: 'white',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title={t('events.share_links')}
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--white)', color: page === 1 ? 'var(--text-muted)' : 'var(--primary)', cursor: page === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                        ><ChevronLeft size={16} /> Prev</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                style={{ width: '38px', height: '38px', borderRadius: '8px', border: p === page ? 'none' : '1px solid var(--border)', background: p === page ? 'var(--primary)' : 'var(--white)', color: p === page ? 'white' : 'var(--text-main)', fontWeight: p === page ? 700 : 400, cursor: 'pointer' }}
                            >{p}</button>
                        ))}

                        <button
                            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={page === totalPages}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--white)', color: page === totalPages ? 'var(--text-muted)' : 'var(--primary)', cursor: page === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                        >Next <ChevronRight size={16} /></button>
                    </div>
                )}
            </div>

            {/* Read More Event Detail Modal */}
            {selectedEvent && (
                <div
                    onClick={() => setSelectedEvent(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 3000, padding: '1rem', animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="glass"
                        style={{
                            width: '100%', maxWidth: '680px', borderRadius: 'var(--radius)',
                            overflow: 'hidden', position: 'relative',
                            background: 'var(--card-bg)', maxHeight: '90vh',
                            display: 'flex', flexDirection: 'column',
                            animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {/* Modal Image */}
                        <div style={{ height: '280px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                            {selectedEvent.image_url ? (
                                <img
                                    src={selectedEvent.image_url.startsWith('http') ? selectedEvent.image_url : `${API_BASE}${selectedEvent.image_url}`}
                                    alt={selectedEvent.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Calendar size={64} color="white" style={{ opacity: 0.4 }} />
                                </div>
                            )}
                            {/* Gradient over image */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)' }} />
                            {/* Category badge */}
                            {selectedEvent.category && (
                                <span style={{
                                    position: 'absolute', top: '1rem', left: '1rem',
                                    background: 'var(--primary)', color: 'white',
                                    padding: '0.35rem 0.9rem', borderRadius: '20px',
                                    fontSize: '0.8rem', fontWeight: 700
                                }}>{selectedEvent.category}</span>
                            )}
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: 'rgba(0,0,0,0.5)', color: 'white',
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)', fontSize: '1.2rem',
                                    cursor: 'pointer', backdropFilter: 'blur(4px)'
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                                {selectedEvent.title}
                            </h2>

                            {/* Meta info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    <div style={{ padding: '0.4rem', background: 'var(--background)', borderRadius: '8px', color: 'var(--primary)' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>
                                        {new Date(selectedEvent.event_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                        {' '}at{' '}
                                        {new Date(selectedEvent.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    <div style={{ padding: '0.4rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#ef4444' }}>
                                        <MapPin size={18} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{selectedEvent.location}</span>
                                </div>
                            </div>

                            {/* Full Description */}
                            <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.8, whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                                {selectedEvent.description}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexShrink: 0 }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleShareImage(selectedEvent); }}
                                disabled={sharingId === selectedEvent.id}
                                className="btn-icon hover-scale"
                                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                            >
                                {sharingId === selectedEvent.id ? <Clock size={16} className="spin" /> : <Download size={16} />}
                                {t('events.share_image')}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleShareText(selectedEvent); }}
                                className="btn-primary"
                                style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                            >
                                <Share2 size={16} /> {t('events.share_links')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
                {events?.map(event => (
                    <div
                        key={`export-${event.id}`}
                        ref={el => shareRefs.current[event.id] = el}
                        style={{
                            width: '1080px',
                            height: '1080px',
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#0f172a'
                        }}
                    >
                        {/* Background Image — low opacity */}
                        {event.image_url && (
                            <img
                                src={event.image_url.startsWith('http') ? event.image_url : `${API_BASE}${event.image_url}`}
                                crossOrigin="anonymous"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.45 }}
                                alt=""
                            />
                        )}

                        {/* Strong Dark Overlay for maximum readability */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(160deg, rgba(10,20,50,0.7) 0%, rgba(5,10,30,0.88) 100%)', zIndex: 1 }}></div>

                        {/* Content Area (takes up space above footer) */}
                        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4rem 4rem 3rem' }}>

                            {/* Top Row: category badge + CEP logo tag */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {event.category ? (
                                    <span style={{
                                        background: '#38bdf8',
                                        color: 'white',
                                        padding: '0.75rem 2rem',
                                        borderRadius: '30px',
                                        fontSize: '1.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 4px 15px rgba(56,189,248,0.4)'
                                    }}>
                                        {event.category}
                                    </span>
                                ) : <div />}
                                <div style={{ textAlign: 'right', background: 'rgba(56,189,248,0.15)', padding: '1.25rem 2rem', borderRadius: '20px', border: '1px solid rgba(56,189,248,0.3)' }}>
                                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0, color: 'white' }}>CEP UR-CE</h2>
                                    <p style={{ fontSize: '1.4rem', margin: '0.4rem 0 0 0', color: '#38bdf8', fontWeight: 600 }}>Rukara Campus</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <h1 style={{ fontSize: '5.5rem', fontWeight: 900, lineHeight: 1.05, margin: 0, letterSpacing: '-1px', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                                    {event.title}
                                </h1>

                                {/* Date & Location Info Bar */}
                                <div style={{ display: 'flex', gap: '3rem', background: 'rgba(255,255,255,0.07)', padding: '2rem 2.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '2rem', fontWeight: 700 }}>
                                        <Calendar size={52} color="#38bdf8" />
                                        <span>
                                            {new Date(event.event_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}<br />
                                            <span style={{ fontSize: '1.5rem', opacity: 0.75, fontWeight: 500 }}>{new Date(event.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '2rem', fontWeight: 700 }}>
                                        <MapPin size={52} color="#f87171" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p style={{ fontSize: '2rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.88)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Footer Stripe — CEP brand teal color from logo */}
                        <div style={{
                            position: 'relative',
                            zIndex: 2,
                            background: '#00b4a6',
                            padding: '1.75rem 4rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <img
                                    src={`${window.location.origin}/cep_logo.jpeg`}
                                    alt="CEP Logo"
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', background: 'white' }}
                                />
                                <div>
                                    <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '0.5px' }}>CEP UR-CE Rukara</p>
                                    <p style={{ margin: 0, fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>Communauté des Étudiants Pentecôtistes</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '1.35rem', color: 'white', fontWeight: 700 }}>{window.location.origin}</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)' }}>Generated by CEP Website</p>
                            </div>
                        </div>
                    </div>
                ))}
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
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
            `}</style>
        </div>
    );
};

export default Events;
