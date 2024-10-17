const { DataTypes } = require("sequelize");
const axios = require("axios");
const sequelize = require("../config/db");
const User = require("./User");
const Event = sequelize.define(
  "Event",
  {
    pays: DataTypes.STRING,
    departement: DataTypes.STRING,
    arrondissement: DataTypes.STRING,
    code_postal: DataTypes.STRING,
    ville: DataTypes.STRING,
    salle: DataTypes.STRING,
    rue: DataTypes.STRING,
    type_braderie: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    heure_debut_visiteur: DataTypes.TIME,
    heure_fin_visiteur: DataTypes.TIME,
    nb_exposants: DataTypes.INTEGER,
    toilettes_publiques: DataTypes.BOOLEAN,
    reserve_aux_particuliers: DataTypes.BOOLEAN,
    exposant_heure_arrivee: DataTypes.TIME,
    emplacement_prix: DataTypes.DECIMAL(5, 2),
    commentaire: DataTypes.TEXT,
    organisateur_personne_morale: DataTypes.STRING,
    organisateur_telephone: DataTypes.STRING,
    organisateur_facebook: DataTypes.STRING,
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    tableName: "event",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Fonction de géocodification pour obtenir les coordonnées à partir du nom de la ville
const geocodeCity = async (city) => {
  try {
    const response = await axios.get(`https://geo.api.gouv.fr/communes`, {
      params: {
        nom: city,
        fields: "centre",
      },
    });

    console.log(`API response for ${city}:`, response.data); // Ajoutez ce log

    if (response.data.length > 0) {
      const { centre } = response.data[0];
      return {
        latitude: centre.coordinates[1],
        longitude: centre.coordinates[0],
      };
    } else {
      console.log(`Aucune coordonnée trouvée pour la ville : ${city}`);
      return null;
    }
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des coordonnées pour la ville : ${city}`,
      error
    );
    return null;
  }
};

// Hook avant l'enregistrement
Event.addHook("beforeSave", async (event) => {
  console.log("Before save hook triggered for event:", event); // Log de l'événement avant la sauvegarde

  // Vérifiez si la ville est spécifiée et que les coordonnées sont nulles
  if (event.ville && (event.latitude === null || event.longitude === null)) {
    const coordinates = await geocodeCity(event.ville);
    if (coordinates) {
      event.latitude = coordinates.latitude;
      event.longitude = coordinates.longitude;
      console.log(`Coordinates for ${event.ville}:`, coordinates); // Log des coordonnées
    }
  }

  // Mettez à jour la colonne location si latitude et longitude sont fournies
  if (event.latitude !== null && event.longitude !== null) {
    const point = {
      type: "Point",
      coordinates: [event.longitude, event.latitude],
    };
    event.location = sequelize.fn("ST_GeomFromGeoJSON", JSON.stringify(point));
  }
});
Event.associate = (models) => {
  Event.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};
module.exports = Event;
