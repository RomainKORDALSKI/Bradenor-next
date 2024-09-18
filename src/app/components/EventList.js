import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import { generateMapLinks } from '@/app/utils/generateMapLinks';
import { generateShareLinks } from '@/app/utils/generateShareLinks';
import { FaWaze, FaMapMarkedAlt, FaFacebook, FaInstagram, FaHeart, FaClock, FaEuroSign, FaQuestion, FaFacebookSquare, FaPhone, FaStore } from 'react-icons/fa';
import Pagination from './events/admindashboard/Pagination';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const EventList = ({ events, grouped, showCity, showDetails, closeModal, eventsPerPage = 8}) => {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [currentPage, setCurrentPage] = useState(1);


  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const groupedEvents = grouped
    ? currentEvents.reduce((acc, event) => {
        const date = new Date(event.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(event);
        return acc;
      }, {})
    : { '': currentEvents };

  const handleAddFavorite = async (eventId) => {
    try {
      await addFavorite(eventId);
    } catch (error) {
      console.error('Error adding favorite', error);
    }
  };

  const handleRemoveFavorite = async (eventId) => {
    try {
      await removeFavorite(eventId);
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="eventlist">
      {Object.keys(groupedEvents).map((date, index) => (
        <div key={index}>
          {grouped && <h3>{date}</h3>}
          <ul>
            {groupedEvents[date].map((event) => {
              const { wazeLink, googleMapsLink } = generateMapLinks(event.rue, event.departement, event.code_postal);
              const { facebookShareUrl, instagramShareUrl } = generateShareLinks(event);

              const isFavorite = favorites.includes(event.id);

              return (
                <li key={event.id} className="event-card">
                  <div className="event-header">
                    <h4>{showCity ? event.ville : new Date(event.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</h4>
                    <div className="map-links">
                      <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="icon" />
                      </a>
                      <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="icon" />
                      </a>
                    </div>
                  </div>

                  <div className="event-body">
                    <div className='container-links'>

                    <div className="exposant-info">
                      {event.nb_exposants !== null && <p><FaStore /><p></p> {event.nb_exposants} exposants</p>}
                    </div>
                    <Link href={`/cityevents/${event.ville}`} className="links" onClick={closeModal}>
                      <div className="event-info">
                        {event.type_braderie && <p>{capitalizeFirstLetter(event.type_braderie)}</p>}
                        {showDetails && event.departement && <p>Département: {event.departement}</p>}
                        {showDetails && event.code_postal && <p>Code Postal: {event.code_postal}</p>}
                        {event.rue && <p>Rue: {event.rue}</p>}
                        {event.salle && <p>Salle: {event.salle}</p>}
                        {showDetails && event.heure_debut_visiteur && event.heure_fin_visiteur && (
                          <p>
                            <FaClock /> Horaire : {`${event.heure_debut_visiteur.slice(0, 5)} à ${event.heure_fin_visiteur.slice(0, 5)}`}
                          </p>
                        )}
                        {showDetails && event.reserve_aux_particuliers && <p><FaQuestion /> Réservé aux particuliers</p>}
                        {showDetails && event.emplacement_prix && <p><FaEuroSign /> Prix de l'emplacement: {event.emplacement_prix} €</p>}
                        {showDetails && event.commentaire && <p>Commentaire: {event.commentaire}</p>}
                        {showDetails && event.organisateur_personne_morale && <p>Organisateur: {event.organisateur_personne_morale}</p>}
                        {showDetails && event.organisateur_telephone && <p><FaPhone /> {event.organisateur_telephone}</p>}
                        {showDetails && event.organisateur_facebook && <p><FaFacebookSquare /> Facebook: {event.organisateur_facebook}</p>}
                        {!showDetails && event.distance !== undefined && event.distance !== 0 && <p className="distance">Distance: {event.distance?.toFixed(2)} km</p>}
                        {event.arrondissement && <p className="distance">Du côté de {event.arrondissement}.</p>}
                      </div>
                      </Link>
                    <div className="share-icons">
                    <a href={wazeLink} target="_blank" rel="noopener noreferrer">
                        <FaWaze className="icon" />
                      </a>
                      <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                        <FaMapMarkedAlt className="icon" />
                      </a>
                      <FaHeart
                        className={`icon ${isFavorite ? 'favorite' : ''}`}
                        onClick={() => isFavorite ? handleRemoveFavorite(event.id) : handleAddFavorite(event.id)}
                      />
                    </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <Pagination
        eventsPerPage={eventsPerPage}
        totalEvents={events.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default EventList;
