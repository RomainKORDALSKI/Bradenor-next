import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import Select from 'react-select';

const NavNearby = ({ closeModal }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cachedPosition, setCachedPosition] = useState(null);

  const handleInputChange = async (value) => {
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,code,codesPostaux,codeDepartement&boost=population&limit=10`);
        const options = response.data.map((item) => ({
          value: item,
          label: `${item.nom}, ${item.codesPostaux}`,
        }));
        setSuggestions(options);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (selectedOption) => {
    if (selectedOption) {
      const { nom, codeDepartement, codesPostaux } = selectedOption.value;
      const codePostal = codesPostaux && codesPostaux.length > 0 ? codesPostaux[0] : ''
      setQuery(`${nom}, ${codeDepartement} (${codePostal})`);
      setSuggestions([]);
      router.push(`/${codeDepartement}/${nom}?cp=${codePostal}`);
      closeModal();
    }
  };

  const handleLocateMe = async () => {
    setLoading(true);
    
    try {
      let position = cachedPosition;
      
      if (!position) {
          position = await getCurrentPosition();
        setCachedPosition(position);
      }
      
      const { latitude, longitude } = position.coords;
      const response = await axios.get(`https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=nom,codeDepartement&limit=1`);
      const city = response.data[0];
      const department = city.codeDepartement;
      const cityName = city.nom;
      router.push(`/${department}/${cityName}?lat=${latitude}&lon=${longitude}`);
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la localisation :', error.message);
    } finally {
      setLoading(false);
    }
  };    
    

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(new Error('Impossible d\'obtenir la position actuelle.'))
      );
    });
  };

  return (
    <div className="search_nearby">
      <Select 
        inputValue={query}
        onInputChange={handleInputChange}
        onChange={handleSuggestionSelect}
        options={suggestions}
        placeholder="Recherchez une ville"
        noOptionsMessage={() => 'Aucune suggestion trouvée'}
        theme={(theme) => ({
          ...theme,
          borderRadius: 3,
          colors: {
            ...theme.colors,
            primary25: '#f7c548d2',
            primary: '#437C90',
            neutral0: '#eae5c1',
            neutral20: '#437C90',
          },
        })}
      />
      <button className="cta-button" onClick={() => handleSuggestionSelect(suggestions[0])}>
        <FiSearch /> Rechercher
      </button>
      <button
        className="cta-button"
        onClick={handleLocateMe}
        disabled={loading}
      >
        <FiMapPin />
        {loading ? ' Recherche en cours...' : ' Me localiser'}
      </button>
    </div>
  );
};

export default NavNearby;




