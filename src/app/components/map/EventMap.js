import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Image from 'next/legacy/image';


const EventMap = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events/allevents');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const eventsData = await response.json();
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const EventMapComponent = dynamic(() => import('./EventMapComponent'), {
        loading: () => <p>Loading Map...</p>,
        ssr: false
    });

    if (loading) {
        return <p>Loading events...</p>;
    }

    return (
        <div className="homepage">
            <header className="header-map">
                <div className="intro">
                    <div className="imageContainer">
                        <Image src="/images/braderie2.jpg" alt="Image de braderie" className="headerImage" width={600} height={400} />
                    </div>
                    <div className="textContainer">
                        <h1>Bienvenue sur BradEnOr</h1>
                        <p>
                            Bonjour et bienvenue sur notre site dédié aux braderies des Hauts-de-France !
                            Ce projet a été créé par un développeur web en formation pour faciliter la recherche
                            de braderies dans notre région.
                        </p>
                        
                            <strong>Fonctionnalités pour les visiteurs :</strong>
                            <ul>
                                <li>Recherche de braderies par géolocalisation, par ville ou directement sur la carte.</li>
                                <li>Redirection directe de l'adresse sur Waze ou Google Maps.</li>
                                <li>Possibilité d'ajouter des événements en favoris.</li>
                            </ul>
                        
                        
                            <strong>Fonctionnalités pour les organisateurs :</strong>
                            <ul>
                                <li>Publication de vos événements via un formulaire dédié.</li>
                            </ul>
                        
                        <p>
                            Nous espérons que ce site vous aidera à trouver et organiser les meilleures braderies de la région.
                            Bonne recherche !
                        </p>
                    </div>
                </div>
            </header>
            <h2>Carte des braderies</h2>
            {events.length > 0 ? (
                <EventMapComponent events={events} />
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
};

export default EventMap;


