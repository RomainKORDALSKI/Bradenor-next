const Event = require("../models/Event");
const User = require("../models/User");
const sequelize = require("../config/db"); // Importation de l'instance Sequelize
const { use } = require("react");

// Tableau de villes et départements
const cities = [
  { ville: "Paris", departement: "75" },
  { ville: "Lyon", departement: "69" },
  { ville: "Marseille", departement: "13" },
  { ville: "Bordeaux", departement: "33" },
  { ville: "Nice", departement: "06" },
  { ville: "Lille", departement: "59" },
  { ville: "Nantes", departement: "44" },
  { ville: "Strasbourg", departement: "67" },
  { ville: "Rennes", departement: "35" },
  { ville: "Toulouse", departement: "31" },
  { ville: "Montpellier", departement: "34" },
  { ville: "Le Havre", departement: "76" },
  { ville: "Grenoble", departement: "38" },
  { ville: "Dijon", departement: "21" },
  { ville: "Aix-en-Provence", departement: "13" },
  { ville: "Orléans", departement: "45" },
  { ville: "Rouen", departement: "76" },
  { ville: "Reims", departement: "51" },
  { ville: "Metz", departement: "57" },
  { ville: "Nancy", departement: "54" },
  { ville: "Angers", departement: "49" },
  { ville: "Caen", departement: "14" },
  { ville: "Saint-Étienne", departement: "42" },
  { ville: "Brest", departement: "29" },
  { ville: "Limoges", departement: "87" },
  { ville: "Tours", departement: "37" },
  { ville: "Amiens", departement: "80" },
  { ville: "Perpignan", departement: "66" },
  { ville: "Besançon", departement: "25" },
  { ville: "Clermont-Ferrand", departement: "63" },
  { ville: "Pau", departement: "64" },
  { ville: "Avignon", departement: "84" },
  { ville: "Mulhouse", departement: "68" },
  { ville: "Chambéry", departement: "73" },
  { ville: "Bayonne", departement: "64" },
  { ville: "Ajaccio", departement: "20" },
  { ville: "Troyes", departement: "10" },
  { ville: "Nîmes", departement: "30" },
  { ville: "Vannes", departement: "56" },
  { ville: "Valence", departement: "26" },
  { ville: "La Rochelle", departement: "17" },
  { ville: "Cherbourg", departement: "50" },
  { ville: "Cannes", departement: "06" },
  { ville: "Évry", departement: "91" },
  { ville: "Saint-Malo", departement: "35" },
  { ville: "Quimper", departement: "29" },
  { ville: "Colmar", departement: "68" },
  { ville: "Le Mans", departement: "72" },
  { ville: "Niort", departement: "79" },
];

async function seedDatabase() {
  try {
    // Synchroniser la base de données avant d'insérer les données
    await sequelize.sync({ force: true }); // Utilisez `force: false` si vous ne voulez pas supprimer les données existantes

    // Créer les utilisateurs
    const adminUser = await User.create({
      email: "admin@example.com",
      nom: "Admin",
      prenom: "Admin",
      password: "adminpassword", // N'oubliez pas que le mot de passe sera haché
      role: "admin",
    });
    console.log("Utilisateur admin créé :", adminUser);

    const regularUser = await User.create({
      email: "user@example.com",
      nom: "User",
      prenom: "Regular",
      password: "userpassword", // N'oubliez pas que le mot de passe sera haché
      role: "user",
    });
    console.log("Utilisateur régulier créé :", regularUser);

    // Créer 50 événements avec des villes différentes
    for (let i = 0; i < 50; i++) {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const event = await Event.create({
        pays: "France",
        departement: randomCity.departement,
        arrondissement: `${Math.floor(Math.random() * 20) + 1}e`, // Exemple aléatoire d'arrondissement
        code_postal: "75001", // Tu peux aussi générer des codes postaux aléatoires
        ville: randomCity.ville,
        salle: "Salle des fêtes",
        rue: "Rue de la paix",
        type_braderie: "Brocante",
        date: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
          2,
          "0"
        )}`, // Date aléatoire en janvier 2024
        heure_debut_visiteur: "10:00:00",
        heure_fin_visiteur: "18:00:00",
        nb_exposants: Math.floor(Math.random() * 100) + 10, // Nombre aléatoire d'exposants entre 10 et 100
        toilettes_publiques: Math.random() < 0.5,
        reserve_aux_particuliers: Math.random() < 0.5,
        emplacement_prix: (Math.random() * 10).toFixed(2), // Prix d'emplacement aléatoire
        commentaire: "Événement super sympa !",
        organisateur_personne_morale: `Organisateur ${i + 1}`,
        organisateur_telephone: `01234567${Math.floor(
          100 + Math.random() * 900
        )}`,
        organisateur_facebook: `fb.com/organisateur${i + 1}`,
        latitude: null,
        longitude: null,
        userId: i % 2 === 0 ? adminUser.id : regularUser.id, // Alterner entre les utilisateurs admin et régulier
      });
      console.log(`Événement ${i + 1} créé :`, event.ville);
    }

    console.log("50 événements créés avec succès !");
  } catch (error) {
    console.error("Erreur lors de la seed de la base de données :", error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
  }
}

// Exécuter le script de seed
seedDatabase();
