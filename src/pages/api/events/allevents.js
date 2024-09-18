
import Event from '@/app/models/Event';

export default async function handler(req, res) {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching all events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
  
