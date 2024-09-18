// pages/api/admin/index.js
import Event from '@/app/models/Event';
import authAdmin from '@/pages/api/middleware/authAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    authAdmin(req, res, async () => {
      try {
        const events = await Event.findAll();
        res.status(200).json(events);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des événements', error });
      }
    });
  } else {
    res.status(405).end(`Méthode ${req.method} Non Autorisée`);
  }
}

