import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const EventList = lazy(() => import('@/app/components/EventList'));

const NearbyEvents = ({ lat, lon, city, cp }) => {
  const router = useRouter();
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceOption, setDistanceOption] = useState('under10km');
  const [distance, setDistance] = useState(10);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const distanceOptions = [
    { label: 'Moins de 10 km', value: 'under10km', maxDistance: 10 },
    { label: 'Moins de 20 km', value: 'under20km', maxDistance: 20 },
    { label: 'Moins de 35 km', value: 'under35km', maxDistance: 35 },
    { label: 'Plus de 35 km', value: 'over35km', maxDistance: 1000 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if ((lat && lon) || city) {
        setLoading(true);
        try {
          const maxDistance = distanceOptions.find(option => option.value === distanceOption).maxDistance;
          let response;

          if (city) {
            response = await axios.get(`/api/events/nearby?city=${city}&cp=${cp}&maxDistance=${maxDistance}`);
          } else if (lat && lon) {
            response = await axios.get(`/api/events/nearby?latitude=${lat}&longitude=${lon}&maxDistance=${maxDistance}`);
          }

          if (response) {
            setNearbyEvents(response.data);
            setFilteredEvents(response.data);
            const dates = Array.from(new Set(response.data.map(event => event.date)));
            setAvailableDates(dates);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des événements proches :', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [lat, lon, city, distanceOption]);

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setDistanceOption(selectedOption);
    const maxDistance = distanceOptions.find(option => option.value === selectedOption).maxDistance;
    setDistance(maxDistance);
    setSelectedDate('');
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    filterEventsByDate(selectedDate);
  };

  const filterEventsByDate = (date) => {
    if (date) {
      const filtered = nearbyEvents.filter(event => event.date === date);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(nearbyEvents);
    }
  };

  return (
    <div className="eventlist">
      <h2>Événements proches :</h2>
      <div className="filters">
        <div className="distance-filter">
          <label htmlFor="distanceOption">Sélectionnez une distance :</label>
          <select
            id="distanceOption"
            name="distanceOption"
            value={distanceOption}
            onChange={handleOptionChange}
          >
            {distanceOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="date-filter">
          <label htmlFor="dateOption">Sélectionnez une date :</label>
          <select
            id="dateOption"
            name="dateOption"
            value={selectedDate}
            onChange={handleDateChange}
          >
            <option value="">Toutes les dates</option>
            {availableDates.map(date => (
              <option key={date} value={date}>{new Date(date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <p className='not-found'>Chargement...</p>
      ) : (
        <Suspense fallback={<div className='not-found'>Chargement...</div>}>
          <EventList events={filteredEvents} grouped={true} showCity={true} showDetails={false} />
        </Suspense>
      )}
    </div>
  );
};

export default NearbyEvents;







