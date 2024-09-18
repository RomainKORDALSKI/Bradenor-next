import Event from '@/app/models/Event';

export default async function handler(req, res) {
    try {
      const events = await Event.findAll({
        attributes: ['date'],
      });
      res.status(200).json(events);
    } catch (error) {
      console.error('Erreur lors de la récupération des dates des événements:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des dates des événements' });
    }
  }
