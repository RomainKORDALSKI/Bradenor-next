import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddEvent() {

  const [event, setEvent] = useState({
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
    nb_exposants: '',
    toilettes_publiques: false,
    reserve_aux_particuliers: false,
    exposant_heure_arrivee: '',
    emplacement_prix: '',
    commentaire: '',
    organisateur_personne_morale: '',
    organisateur_telephone: '',
    organisateur_facebook: '',
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/user/login');
    } else {
      fetch('/api/protected-route', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            router.push('/user/login');
          }
        })
        .catch(() => {
          router.push('/login');
        });
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    setTouchedFields(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  const isFieldInvalid = (fieldName) => {
    return touchedFields[fieldName] && !event[fieldName] && isFieldRequired(fieldName);
  };

  const isFieldRequired = (fieldName) => {
    return ['pays', 'departement', 'code_postal', 'rue', 'type_braderie', 'ville', 'date'].includes(fieldName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const requiredFields = ['pays', 'departement', 'code_postal', 'rue', 'type_braderie', 'ville'];
    for (const field of requiredFields) {
      if (!event[field]) {
        setError(`Le champ ${field} est requis.`);
        return;
      }
    }
  
    try {
      const res = await fetch('/api/user/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(event)
      });
  
      if (res.ok) {
        router.push('/events');
      } else {
        const data = await res.json();
        setError(data.message || 'Une erreur est survenue lors de la création de l\'événement.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      setError('Une erreur est survenue lors de la création de l\'événement.');
    }
  };

  return (
    <div className='add-event'>
      <h1>Ajouter un événement</h1>
      <p className="required-fields-note">Les champs marqués d'un * sont obligatoires</p>
      <form onSubmit={handleSubmit}>
        <div className={`form-field ${isFieldInvalid('pays') ? 'invalid' : ''}`}>
          <label htmlFor="pays">Pays: *</label>
          <select id="pays" name="pays" value={event.pays} onChange={handleChange} required>
            <option value="">Sélectionnez un pays</option>
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
          </select>
        </div>
        <div className={`form-field ${isFieldInvalid('departement') ? 'invalid' : ''}`}>
          <label htmlFor="departement">Département: *</label>
          <select id="departement" name="departement" value={event.departement} onChange={handleChange} required>
            <option value="">Sélectionnez un département</option>
            <option value="Nord">Nord</option>
            <option value="Pas-de-Calais">Pas-de-Calais</option>
            <option value="Autre">Autre</option>
          </select>
          {event.departement === 'Autre' && (
            <input
              type="text"
              name="departement"
              value={event.departement === 'Autre' ? '' : event.departement}
              onChange={handleChange}
              placeholder="Entrez le département"
              required
            />
          )}
        </div>
        <div className="form-field">
          <label htmlFor="arrondissement">Arrondissement:</label>
          <input type="text" id="arrondissement" name="arrondissement" value={event.arrondissement} onChange={handleChange} />
        </div>
        <div className={`form-field ${isFieldInvalid('code_postal') ? 'invalid' : ''}`}>
          <label htmlFor="code_postal">Code postal: *</label>
          <input type="text" id="code_postal" name="code_postal" value={event.code_postal} onChange={handleChange} required />
        </div>
        <div className={`form-field ${isFieldInvalid('ville') ? 'invalid' : ''}`}>
          <label htmlFor="ville">Ville: *</label>
          <input type="text" id="ville" name="ville" value={event.ville} onChange={handleChange} required/>
        </div>
        <div className="form-field">
          <label htmlFor="salle">Salle:</label>
          <input type="text" id="salle" name="salle" value={event.salle} onChange={handleChange} />
        </div>
        <div className={`form-field ${isFieldInvalid('rue') ? 'invalid' : ''}`}>
          <label htmlFor="rue">Rue: *</label>
          <input type="text" id="rue" name="rue" value={event.rue} onChange={handleChange} required />
        </div>
        <div className={`form-field ${isFieldInvalid('type_braderie') ? 'invalid' : ''}`}>
          <label htmlFor="type_braderie">Type de braderie: *</label>
          <select id="type_braderie" name="type_braderie" value={event.type_braderie} onChange={handleChange} required>
            <option value="">Sélectionnez un type</option>
            <option value="Marché aux puces">Marché aux puces</option>
            <option value="Brocante">Brocante</option>
            <option value="Vide grenier">Vide grenier</option>
            <option value="Autre">Autre</option>
          </select>
          {event.type_braderie === 'Autre' && (
            <input
              type="text"
              name="type_braderie"
              value={event.type_braderie === 'Autre' ? '' : event.type_braderie}
              onChange={handleChange}
              placeholder="Entrez le type de braderie"
              required
            />
          )}
        </div>
        <div className={`form-field ${isFieldInvalid('date') ? 'invalid' : ''}`}>
          <label htmlFor="date">Date: *</label>
          <input type="date" id="date" name="date" value={event.date} onChange={handleChange} required/>
        </div>
        <div className="form-field">
          <label htmlFor="heure_debut_visiteur">Heure de début pour les visiteurs:</label>
          <input type="time" id="heure_debut_visiteur" name="heure_debut_visiteur" value={event.heure_debut_visiteur} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="heure_fin_visiteur">Heure de fin pour les visiteurs:</label>
          <input type="time" id="heure_fin_visiteur" name="heure_fin_visiteur" value={event.heure_fin_visiteur} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="nb_exposants">Nombre d'exposants:</label>
          <input type="number" id="nb_exposants" name="nb_exposants" value={event.nb_exposants} onChange={handleChange} />
        </div>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="toilettes_publiques" checked={event.toilettes_publiques} onChange={handleChange} />
            Toilettes publiques
          </label>
        </div>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="reserve_aux_particuliers" checked={event.reserve_aux_particuliers} onChange={handleChange} />
            Réservé aux particuliers
          </label>
        </div>
        <div className="form-field">
          <label htmlFor="exposant_heure_arrivee">Heure d'arrivée des exposants:</label>
          <input type="time" id="exposant_heure_arrivee" name="exposant_heure_arrivee" value={event.exposant_heure_arrivee} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="emplacement_prix">Prix de l'emplacement:</label>
          <input type="number" id="emplacement_prix" name="emplacement_prix" value={event.emplacement_prix} onChange={handleChange} step="0.01" />
        </div>
        <div className="form-field">
          <label htmlFor="commentaire">Commentaire:</label>
          <textarea id="commentaire" name="commentaire" value={event.commentaire} onChange={handleChange}></textarea>
        </div>
        <div className="form-field">
          <label htmlFor="organisateur_personne_morale">Organisateur (personne morale):</label>
          <input type="text" id="organisateur_personne_morale" name="organisateur_personne_morale" value={event.organisateur_personne_morale} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="organisateur_telephone">Téléphone de l'organisateur:</label>
          <input type="tel" id="organisateur_telephone" name="organisateur_telephone" value={event.organisateur_telephone} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="organisateur_facebook">Facebook de l'organisateur:</label>
          <input type="text" id="organisateur_facebook" name="organisateur_facebook" value={event.organisateur_facebook} onChange={handleChange} />
        </div>
        {error && (
          <div className="errorMessage">
            <span className="errorIcon">⚠️</span> {error}
          </div>
        )}
        <button type="submit">Ajouter l'événement</button>
      </form>
    </div>
  );
}