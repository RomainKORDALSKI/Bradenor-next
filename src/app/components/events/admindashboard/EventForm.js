// components/EventForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const initialFormData = {
  pays: '',
  departement: '',
  arrondissement: '',
  code_postal: '',
  ville: '',
  salle: '',
  rue: '',
  type_braderie: '',
  date: '',
  heure_debut_visiteur: '',
  heure_fin_visiteur: '',
  nb_exposants: 0,
  toilettes_publiques: false,
  reserve_aux_particuliers: false,
  exposant_heure_arrivee: '',
  emplacement_prix: '',
  commentaire: '',
  organisateur_personne_morale: '',
  organisateur_telephone: '',
  organisateur_facebook: '',
  latitude: '',
  longitude: ''
};

export default function EventForm({ event, onSave }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData(initialFormData); // Reset form data to initial state when event is null or undefined
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (event && event.id) {
        await axios.put(`/api/admin/update?id=${event.id}`, formData);
      } else {
        await axios.post('/api/admin/create', formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };



  return (
    <div className='form-container'>
      <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className='form-group' key={key}>
            <label>{key}</label>
            <input
              name={key}
              type={typeof formData[key] === 'boolean' ? 'checkbox' : 'text'}
              value={formData[key]}
              checked={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">Save Event</button>
      </form>
    </div>
  );
}

