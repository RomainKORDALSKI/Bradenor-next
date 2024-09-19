import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Récupérer les variables d'environnement
const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;

// Construire l'URL de connexion
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
dialectModule: require('pg'),
  define: {
    underscored: true,
  },
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;

// Tester la connexion à la base de données
