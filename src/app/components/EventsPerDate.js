import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import EventList from '@/app/components/EventList';

const EventsPerDate = ({ date }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEventsForDate = async () => {
      try {
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        const response = await fetch(`/api/events/date?date=${formattedDate}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    };

    fetchEventsForDate();
  }, [date]);

  return (
    <div >
      {events.length > 0 ? (
    <div className="eventlist">
    <h2>Événements du {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</h2>
    <EventList events={events} grouped={false} showCity={true} showDetails={true} />
  </div>
      ) : (
        <p className='not-found'>Aucun événement pour cette date.</p>
      )}
    </div>
  );
};

export default EventsPerDate;
