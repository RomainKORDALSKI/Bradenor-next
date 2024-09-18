const axios = require('axios');
const { Sequelize } = require('sequelize');
const Event = require('./../server/models/Event');

async function geocodeCity(city) {
  try {
    const response = await axios.get(`https://geo.api.gouv.fr/communes`, {
      params: {
        nom: city,
        fields: 'centre',
      },
    });

    if (response.data.length > 0) {
      const { centre } = response.data[0];
      return {
        latitude: centre.coordinates[1],
        longitude: centre.coordinates[0],
      };
    } else {
      console.log(`No coordinates found for city: ${city}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching coordinates for city: ${city}`, error);
    return null;
  }
}

async function updateEventCoordinates() {
  const events = await Event.findAll({
    where: {
      latitude: { [Sequelize.Op.is]: null },
      longitude: { [Sequelize.Op.is]: null },
    },
  });

  for (const event of events) {
    const coordinates = await geocodeCity(event.ville);

    if (coordinates) {
      event.latitude = coordinates.latitude;
      event.longitude = coordinates.longitude;
      await event.save();
      console.log(`Updated event ${event.id} with coordinates: (${coordinates.latitude}, ${coordinates.longitude})`);
    }
  }
}

updateEventCoordinates().then(() => {
  console.log('Finished updating event coordinates');
  process.exit();
}).catch(err => {
  console.error('Error updating event coordinates:', err);
  process.exit(1);
});
