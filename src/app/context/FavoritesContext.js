import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/api/favorites');
        setFavorites(response.data.favorites || []);
      } catch (error) {
        console.error('Error fetching favorites', error);
      }
    };

    fetchFavorites();
  }, []);

  const addFavorite = async (eventId) => {
    try {
      await axios.post('/api/favorites/add', { id: eventId });
      setFavorites([...favorites, eventId]);
    } catch (error) {
      console.error('Error adding favorite', error);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      await axios.post('/api/favorites/remove', { id: eventId });
      setFavorites(favorites.filter(id => id !== eventId));
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export { FavoritesContext, FavoritesProvider };


