const { DataTypes } = require('sequelize');
const sequelize = require('@/app/config/db');


const Event = sequelize.define('Event', {
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
    }
}, {
    tableName: 'event',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


module.exports = Event;

