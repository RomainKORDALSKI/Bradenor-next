import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import EventForm from '@/app/components/events/admindashboard/EventForm';
import Header from '@/app/components/header/Header';
import Searchform from '@/app/components/events/admindashboard/Search';
import Search from '@/app/components/header/Search';
import Pagination from '@/app/components/events/admindashboard/Pagination';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;
  const [isAscending, setIsAscending] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/user/login');
    } else {
      axios.get('/api/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Vous avez accès à la route protégée admin');
          fetchEvents(token); // Charger les événements une fois que l'accès est confirmé
        })
        .catch(error => {
          console.error('Erreur lors de la vérification de l\'accès à la route protégée admin:', error);
          router.push('/'); // Redirige l'utilisateur non autorisé
        });
    }
  }, []);

  const fetchEvents = async (token) => {
    try {
      const response = await axios.get('/api/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response.status === 401) {
        router.push('/user/login'); // Redirection en cas d'erreur d'authentification
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/delete?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchEvents(token); // Recharger les événements après la suppression
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    fetchEvents(token); // Recharger les événements après la sauvegarde
    setSelectedEvent(null);
  };

  const handleResetForm = () => {
    setSelectedEvent(null);
  };

  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const filtered = events.filter(event =>
      event.id.toString().includes(term) ||
      event.ville.toLowerCase().includes(term) ||
      event.date.includes(term)
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleSortByDate = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      return isAscending ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    });
    setFilteredEvents(sortedEvents);
    setIsAscending(!isAscending);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <Search />
      <Searchform onSearch={handleSearch} />
      <div className='dashboard-container'>
        <h1>Admin Dashboard</h1>
        <button onClick={handleSortByDate}>Trier par date {isAscending ? '▲' : '▼'}</button>
        <ul>
          {currentEvents.map(event => (
            <li key={event.id}>
              <h3>{event.ville}</h3>
              <p>ID : {event.id}</p>
              <p>Date : {new Date(event.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p>Ajoutée le : {new Date(event.created_at).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <button onClick={() => handleEditEvent(event)}>Edit</button>
              <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <Pagination
          eventsPerPage={eventsPerPage}
          totalEvents={filteredEvents.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        <button onClick={handleResetForm}>Create New Event</button>
        <EventForm event={selectedEvent} onSave={handleSave} />
      </div>
    </div>
  );
};

export default AdminDashboard;






