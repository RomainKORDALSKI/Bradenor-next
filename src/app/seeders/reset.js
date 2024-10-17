const { sequelize } = require("../models");
const resetDatabase = async () => {
  try {
    // Supprime toutes les tables de la base de données
    await sequelize.drop();
    console.log("Toutes les tables ont été supprimées.");

    // Synchronisation des modèles pour recréer les tables
    await sequelize.sync({ force: true });
    console.log("Toutes les tables ont été recréées.");
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation de la base de données :",
      error
    );
  } finally {
    // Fermer la connexion
    await sequelize.close();
  }
};

resetDatabase();
