import middleware from '@/pages/api/middleware/middleware';

const handler = async (req, res, session) => {
  try {
    if (req.method === 'POST') {
      const eventId = req.body;

      if (!session) {
        console.error('Erreur : La session n\'est pas définie');
        res.status(500).json({ message: 'Session error' });
        return;
      }

      let favorites = session.favorites || [];

      if (favorites.includes(eventId.id)) {
        favorites = favorites.filter(id => id !== eventId.id);
        session.favorites = favorites;
        await session.save();
        res.status(200).json({ message: 'Favorite removed successfully', favorites });
      } else {
        res.status(400).json({ message: 'Event not found in favorites' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error removing favorite', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default middleware(handler);





