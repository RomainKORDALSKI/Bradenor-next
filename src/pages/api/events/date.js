import Event from '@/app/models/Event';
export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { date } = req.query;
  
      try {
        if (!date) {
          return res.status(400).json({ message: 'Paramètre date manquant.' });
        }
        const formattedDate = new Date(date);
  
        const events = await Event.findAll({
          where: {
            date: formattedDate 
          }
        });
        res.status(200).json(events);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements par date:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des événements.' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
  }

