import Event from '@/app/models/Event';
import auth from '@/pages/api/middleware/auth';

export default async function handler(req, res) {
  // Utilisation du middleware d'authentification
  auth(req, res, async () => {
    if (req.method === 'POST') {
      const eventData = req.body;

      // Vérification des champs requis
      const requiredFields = ['pays', 'departement', 'code_postal', 'rue', 'type_braderie', 'ville'];
      for (const field of requiredFields) {
        if (!eventData[field]) {
          return res.status(400).json({ message: `Le champ ${field} est requis.` });
        }
      }

      // Liste des champs non obligatoires qui peuvent être null
      const nullableFields = [
        'arrondissement', 'salle', 'heure_debut_visiteur', 'heure_fin_visiteur',
        'nb_exposants', 'toilettes_publiques', 'reserve_aux_particuliers', 
        'exposant_heure_arrivee', 'emplacement_prix', 'commentaire',
        'organisateur_personne_morale', 'organisateur_telephone', 'organisateur_facebook'
      ];

      // Parcourir les champs et assigner null si la valeur est vide
      nullableFields.forEach(field => {
        if (!eventData[field]) {
          eventData[field] = null;
        }
      });

      try {
        const event = await Event.create(eventData);
        res.status(201).json(event);
      } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error });
      }
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}