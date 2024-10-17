const db = require("../models"); // Assurez-vous que le chemin est correct

async function syncDatabase() {
  try {
    // Synchroniser tous les modèles
    await db.sequelize.sync({ force: false }); // `force: true` pour supprimer et recréer les tables
    console.log("Les tables ont été créées ou mises à jour avec succès !");
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation de la base de données :",
      error
    );
  }
}

// Exécuter la synchronisation
syncDatabase();
