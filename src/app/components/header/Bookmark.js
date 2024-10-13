import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import EventList from "@/app/components/EventList";
import { FavoritesContext } from "@/app/context/FavoritesContext";

const Bookmark = ({ closeModal }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/allevents");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (favorites.length === 0) {
      const timer = setTimeout(() => {
        closeModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [favorites]);

  const removeFavoriteFromFavorites = async (eventId) => {
    try {
      setLoading(true);
      await axios.post("/api/favorites/remove", { id: eventId });
      removeFavorite(eventId);
    } catch (error) {
      console.error("Error removing favorite", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorite-events">
      <h2>Mes Favoris :</h2>
      {favorites.length === 0 ? (
        <p className="favorite-p">Aucun favori pour le moment.</p>
      ) : (
        <EventList
          events={events.filter((event) => favorites.includes(event.id))}
          grouped={false}
          showCity={true}
          showDetails={false}
          removeFavoriteFromFavorites={removeFavoriteFromFavorites}
          loading={loading}
          eventsPerPage={3}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Bookmark;
