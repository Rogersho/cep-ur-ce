import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Image as ImageIcon, Maximize2, Search, X, ChevronLeft, ChevronRight, Music, Upload } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API_BASE from '../api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const PAGE_SIZE = 12;

const Gallery = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const choirIdParam = searchParams.get('choirId');

    const [selectedImage, setSelectedImage] = useState(null);
    const [search, setSearch] = useState('');
    const [activeAlbum, setActiveAlbum] = useState('all');
    const [activeChoir, setActiveChoir] = useState(choirIdParam || 'all');
    const [mediaType, setMediaType] = useState('all'); // all, image, video
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (choirIdParam) {
            setActiveChoir(choirIdParam);
            setActiveAlbum('all');
            setPage(1);
        }
    }, [choirIdParam]);

    const { data: gallery, isLoading } = useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/gallery`);
            return res.data;
        },
        retry: false
    });

    const { data: albums } = useQuery({
        queryKey: ['albums'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/albums`);
            return res.data;
        },
        retry: false
    });

    const { data: choirs } = useQuery({
        queryKey: ['choirs'],
        queryFn: async () => {
            const res = await axios.get(`${API_BASE}/api/choirs`);
            return res.data;
        },
        retry: false
    });

    const filtered = useMemo(() => {
        const items = gallery || [];
        return items.filter(item => {
            const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
            const matchAlbum = activeAlbum === 'all' || String(item.album_id) === String(activeAlbum);
            const matchChoir = activeChoir === 'all' || String(item.choir_id) === String(activeChoir);
            const matchMedia = mediaType === 'all' || item.media_type === mediaType;
            return matchSearch && matchAlbum && matchChoir && matchMedia;
        });
    }, [gallery, search, activeAlbum, activeChoir, mediaType]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (val) => { 
        setActiveAlbum(val); 
        setActiveChoir('all');
        setSearchParams({});
        setPage(1); 
    };
    const handleSearch = (val) => { setSearch(val); setPage(1); };
    const handleChoirClear = () => { setActiveChoir('all'); setSearchParams({}); setPage(1); };

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>{t('gallery.loading')}</div>;

    const currentChoirName = activeChoir !== 'all' ? choirs?.find(c => String(c.id) === String(activeChoir))?.name : null;
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if user has ANY upload permissions (admin or special perm)
    const { data: myPerms } = useQuery({
        queryKey: ['my-permissions'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/auth/me/permissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!user
    });

    const hasUploadPrivilege = user && (
        ['system_admin', 'cep_admin'].includes(user.role) ||
        (activeChoir !== 'all' && (user.role === 'choir_header' || myPerms?.choirs?.some(c => String(c.id) === String(activeChoir)))) ||
        (activeAlbum !== 'all' && (myPerms?.albums?.some(a => String(a.id) === String(activeAlbum)))) ||
        (activeChoir === 'all' && activeAlbum === 'all' && (
            ['system_admin', 'cep_admin', 'choir_header'].includes(user.role) ||
            myPerms?.choirs?.length > 0 ||
            myPerms?.albums?.length > 0
        ))
    );

    return (
        <div className="gallery-page" style={{
            padding: '4rem 0',
            background: 'linear-gradient(to bottom, var(--background), var(--secondary))',
            minHeight: '100vh',
            transition: 'var(--transition)'
        }}>
            <div className="container">
                {currentChoirName && (
                    <div className="glass" style={{ 
                        padding: '1.5rem 2rem', 
                        marginBottom: '2rem', 
                        borderRadius: 'var(--radius)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderLeft: '5px solid var(--primary)'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                <Music size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} />
                                Viewing Gallery for: <span style={{ color: 'var(--primary)' }}>{currentChoirName}</span>
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Showing images and videos assigned specifically to this choir.</p>
                        </div>
                        <button onClick={handleChoirClear} className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                            Show All Gallery
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('nav.gallery')}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Explore our community moments through photos and videos.</p>
                    </div>
                    {hasUploadPrivilege && (
                        <Link to="/admin/gallery" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
                            <Upload size={20} /> {t('admin.gallery.add_btn')}
                        </Link>
                    )}
                </div>

                {/* ── Filter / Search Bar ── */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                    alignItems: 'center', marginBottom: '2rem',
                    padding: '0.75rem 1.25rem',
                    background: 'var(--white)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search photos…"
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '0.5rem 2rem 0.5rem 2.25rem',
                                borderRadius: '20px', border: '1px solid var(--border)',
                                background: 'var(--background)', color: 'var(--text-main)',
                                fontSize: '0.88rem', outline: 'none'
                            }}
                        />
                        {search && (
                            <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Album and Choir pills */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {[{ id: 'all', title: t('admin.gallery_pills.all') }].map(pill => (
                            <button
                                key={pill.id}
                                onClick={() => { setActiveAlbum('all'); setActiveChoir('all'); setSearchParams({}); setPage(1); }}
                                style={{
                                    padding: '0.35rem 0.9rem', borderRadius: '20px',
                                    fontSize: '0.82rem', fontWeight: (activeAlbum === 'all' && activeChoir === 'all') ? 700 : 500,
                                    border: (activeAlbum === 'all' && activeChoir === 'all') ? 'none' : '1px solid var(--border)',
                                    background: (activeAlbum === 'all' && activeChoir === 'all') ? 'var(--primary)' : 'var(--background)',
                                    color: (activeAlbum === 'all' && activeChoir === 'all') ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                                }}
                            >{pill.title}</button>
                        ))}

                        {albums?.map(album => (
                            <button
                                key={album.id}
                                onClick={() => { setActiveAlbum(String(album.id)); setActiveChoir('all'); setSearchParams({}); setPage(1); }}
                                style={{
                                    padding: '0.35rem 0.9rem', borderRadius: '20px',
                                    fontSize: '0.82rem', fontWeight: activeAlbum === String(album.id) ? 700 : 500,
                                    border: activeAlbum === String(album.id) ? 'none' : '1px solid var(--border)',
                                    background: activeAlbum === String(album.id) ? 'var(--primary)' : 'var(--background)',
                                    color: activeAlbum === String(album.id) ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                                }}
                            >{album.title} {t('admin.gallery_pills.album')}</button>
                        ))}

                        {choirs?.map(choir => (
                            <button
                                key={choir.id}
                                onClick={() => { setActiveChoir(String(choir.id)); setActiveAlbum('all'); setSearchParams({ choirId: choir.id }); setPage(1); }}
                                style={{
                                    padding: '0.35rem 0.9rem', borderRadius: '20px',
                                    fontSize: '0.82rem', fontWeight: activeChoir === String(choir.id) ? 700 : 500,
                                    border: activeChoir === String(choir.id) ? 'none' : '1px solid var(--border)',
                                    background: activeChoir === String(choir.id) ? '#10b981' : 'var(--background)',
                                    color: activeChoir === String(choir.id) ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                                }}
                            >{choir.name} {t('admin.gallery_pills.choir')}</button>
                        ))}
                    </div>

                    <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.25rem' }} />

                    {/* Media Type Filter */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[
                            { id: 'all', label: 'All Media' },
                            { id: 'image', label: 'Photos' },
                            { id: 'video', label: 'Videos' }
                        ].map(type => (
                            <button
                                key={type.id}
                                onClick={() => { setMediaType(type.id); setPage(1); }}
                                style={{
                                    padding: '0.35rem 0.9rem', borderRadius: '20px',
                                    fontSize: '0.82rem', fontWeight: mediaType === type.id ? 700 : 500,
                                    border: mediaType === type.id ? 'none' : '1px solid var(--border)',
                                    background: mediaType === type.id ? '#6366f1' : 'var(--background)',
                                    color: mediaType === type.id ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                                }}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Result count */}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                        {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* ── Grid ── */}
                {paginated.length === 0 ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: 'var(--radius)' }}>
                        <ImageIcon size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
                        <p style={{ color: 'var(--text-muted)' }}>
                            {search || activeAlbum !== 'all' ? 'No results match your filter.' : t('gallery.no_photos')}
                        </p>
                        {(search || activeAlbum !== 'all') && (
                            <button onClick={() => { handleSearch(''); handleFilterChange('all'); }} style={{ marginTop: '1rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="gallery-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {paginated.map((item) => (
                            <div
                                key={item.id}
                                className="glass"
                                style={{
                                    borderRadius: 'var(--radius)', overflow: 'hidden',
                                    height: '260px', position: 'relative', cursor: 'pointer',
                                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: 'var(--shadow)'
                                }}
                                onClick={() => setSelectedImage(item)}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                            >
                                {item.media_type === 'video' ? (
                                    <video src={item.image_path.startsWith('http') ? item.image_path : `${API_BASE}${item.image_path}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                ) : (
                                    <img 
                                        src={item.image_path.startsWith('http') ? optimizeCloudinaryUrl(item.image_path, { width: 400, height: 400 }) : `${API_BASE}${item.image_path}`} 
                                        alt={item.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        loading="lazy"
                                    />
                                )}
                                <div className="gallery-overlay" style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                    display: 'flex', alignItems: 'flex-end', padding: '1.25rem',
                                    opacity: 0, transition: 'opacity 0.3s ease'
                                }}>
                                    <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>{item.title}</h4>
                                </div>
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: 'white', opacity: 0.8 }}>
                                    <Maximize2 size={18} />
                                </div>
                            </div>
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
                                onClick={() => setPage(p)}
                                style={{
                                    width: '38px', height: '38px', borderRadius: '8px',
                                    border: p === page ? 'none' : '1px solid var(--border)',
                                    background: p === page ? 'var(--primary)' : 'var(--white)',
                                    color: p === page ? 'white' : 'var(--text-main)',
                                    fontWeight: p === page ? 700 : 400, cursor: 'pointer'
                                }}
                            >{p}</button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--white)', color: page === totalPages ? 'var(--text-muted)' : 'var(--primary)', cursor: page === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                        >Next <ChevronRight size={16} /></button>
                    </div>
                )}

                {/* ── Lightbox ── */}
                {selectedImage && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)',
                            backdropFilter: 'blur(10px)', zIndex: 2000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '2rem', animation: 'fadeIn 0.25s ease-out'
                        }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                            {selectedImage.media_type === 'video' ? (
                                <video src={selectedImage.image_path.startsWith('http') ? optimizeCloudinaryUrl(selectedImage.image_path, { width: 1280 }) : `${API_BASE}${selectedImage.image_path}`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} controls autoPlay />
                            ) : (
                                <img 
                                    src={selectedImage.image_path.startsWith('http') ? optimizeCloudinaryUrl(selectedImage.image_path, { width: 1600 }) : `${API_BASE}${selectedImage.image_path}`} 
                                    alt={selectedImage.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                                />
                            )}
                            <div style={{ position: 'absolute', bottom: '-3rem', left: 0, right: 0, textAlign: 'center', color: 'white' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedImage.title}</h3>
                            </div>
                            <button
                                style={{
                                    position: 'absolute', top: '-1rem', right: '-1rem',
                                    color: 'white', background: 'var(--primary)',
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.4rem', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', border: 'none'
                                }}
                                onClick={() => setSelectedImage(null)}
                            >&times;</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .gallery-grid div:hover .gallery-overlay { opacity: 1 !important; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Gallery;
