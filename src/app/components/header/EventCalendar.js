import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/router';


registerLocale('fr', fr);
setDefaultLocale('fr');

const EventCalendar = ({ closeModal }) => {
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  // Récupérer toutes les dates d'événements lors du chargement initial du composant
  useEffect(() => {
    const fetchAllEventDates = async () => {
      try {
        const response = await fetch('/api/events/all-dates');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des dates des événements');
        }
        const data = await response.json();
        const dates = data.map(event => parseISO(event.date)); // Convertir les dates en objets Date
        setEventDates(dates);
      } catch (error) {
        console.error('Erreur lors de la récupération des dates des événements:', error);
      }
    };

    fetchAllEventDates();
  }, []);

  // Récupérer les événements pour une date sélectionnée
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
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

    fetchEvents();
  }, [selectedDate]); // Effectue la requête à chaque changement de selectedDate

  const handleDateChange = (date) => {
    setSelectedDate(date);
    navigateToEventsForDate(date);
    closeModal(); // Naviguer vers la page des événements pour la date sélectionnée
  };

  const navigateToEventsForDate = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    router.push(`/date/events/${formattedDate}`);
  };

  // Fonction pour appliquer une classe CSS aux jours spécifiques
  const dayClassName = (date) => {
    return eventDates.some(eventDate => isSameDay(eventDate, date)) ? 'event-day' : undefined;
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
        dayClassName={dayClassName}
        locale="fr"
      />
    </div>
  );
};

export default EventCalendar;











