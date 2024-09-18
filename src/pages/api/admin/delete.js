import Event from '@/app/models/Event';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      const event = await Event.findByPk(id);
      if (event) {
        await event.destroy();
        res.status(200).json({ message: 'Event deleted' });
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event', error });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
