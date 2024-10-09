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
// Tester la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données établie avec succès.");
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la base de données:", error);
  });
module.exports = sequelize;
