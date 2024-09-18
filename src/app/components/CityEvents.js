import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import EventList from '@/app/components/EventList';

const CityEvents = () => {
  const router = useRouter();
  const { city } = router.query;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (city) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`/api/events/search?cityName=${city}`);
          setEvents(response.data);
        } catch (error) {
          console.error("There was an error fetching the events data!", error);
        }
      };
      fetchEvents();
    }
  }, [city]);

  return (
    <div>
      {events.length > 0 ? (
    <div className="eventlist">
      <h2>Événements à {city}</h2>
      <EventList events={events} grouped={false} showCity={false} showDetails={true} />
    </div>
          ) : (
            <p className='not-found'>Aucun événement pour le ville de {city}.</p>
          )}
        </div>
  );
};

export default CityEvents;




