import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
    const { data: events, isLoading, error } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/events');
            return response.data;
        }
    });

    if (isLoading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading events...</div>;
    if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>Error loading events.</div>;

    return (
        <div className="events-page" style={{ padding: '4rem 0' }}>
            <div className="container">
                <h1 className="section-title">Upcoming <span>Events</span></h1>

                {events.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>No upcoming events scheduled at the moment.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {events.map((event) => (
                            <div key={event.id} className="glass" style={{
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ height: '200px', backgroundColor: 'var(--gray-200)', position: 'relative' }}>
                                    {event.image_url ? (
                                        <img
                                            src={`http://localhost:5000${event.image_url}`}
                                            alt={event.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-300)' }}>
                                            <Calendar size={64} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>{event.title}</h3>
                                    <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{event.description}</p>

                                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                                            <Clock size={16} />
                                            {new Date(event.event_date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                            <MapPin size={16} />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
