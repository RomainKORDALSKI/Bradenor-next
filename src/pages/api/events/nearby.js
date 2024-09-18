import axios from 'axios';
import cache from 'memory-cache';
import sequelize from 'sequelize';
import { Event } from '@/app/models';

const { Op } = sequelize;

export default async function handler(req, res) {
  try {
    const { latitude, longitude, city, maxDistance, cp } = req.query;

    let cacheKey;
    let userCoordinates;

    if (latitude && longitude) {
      cacheKey = `nearbyEvents_${latitude}_${longitude}_${maxDistance}`;
      userCoordinates = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    } else if (city) {
      const response = await axios.get(`https://geo.api.gouv.fr/communes?nom=${city}&codePostal=${cp}&fields=centre`);
      if (response.data.length > 0) {
        const { centre: { coordinates } } = response.data[0];
        cacheKey = `nearbyEvents_${city}_${maxDistance}`;
        userCoordinates = { latitude: coordinates[1], longitude: coordinates[0] };
      } else {
        return res.status(400).json({ message: 'City not found.' });
      }
    } else {
      return res.status(400).json({ message: 'Latitude and longitude or city name must be provided.' });
    }

    let cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const distanceInMeters = parseFloat(maxDistance) * 1000;
    const startTime = Date.now();
    const events = await Event.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`ST_DistanceSphere(location, ST_SetSRID(ST_MakePoint(${userCoordinates.longitude}, ${userCoordinates.latitude}), 4326)) / 1000`),
            'distance'
          ]
        ]
      },
      where: sequelize.where(
        sequelize.literal(`
          ST_DWithin(
            ST_Transform(location, 3857), 
            ST_Transform(ST_SetSRID(ST_MakePoint(${userCoordinates.longitude}, ${userCoordinates.latitude}), 4326), 3857),
            ${distanceInMeters}
          )
        `),
        true
      ),
      order: sequelize.literal('distance')
    });

    const endTime = Date.now();
    console.log('Temps de réponse de la requête:', endTime - startTime, 'ms');

    const filteredEvents = events.filter(event => event.dataValues.distance <= maxDistance);
    cache.put(cacheKey, filteredEvents, 30 * 60 * 1000); // Mise en cache pendant 5 minutes

    res.status(200).json(filteredEvents);
  } catch (error) {
    console.error('Error retrieving nearby events:', error);
    res.status(500).json({ message: 'Error retrieving nearby events.' });
  }
}




  