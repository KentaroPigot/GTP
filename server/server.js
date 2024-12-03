const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const sequelize = require("./config/database");
const app = require("./app"); // Charger l'application Express
const port = process.env.PORT || 3080;

const connectDB = async () => {
  try {
    // Test de la connexion à la base de données
    await sequelize.authenticate();
    console.log("MySQL Database connected...");

    // Synchronisation des modèles avec la base de données

    await sequelize.sync({ alter: true }); // Met à jour la structure de la base si nécessaire
    console.log("Database synced!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1); // Quitter l'application si la connexion échoue
  }
};

// Lancer la connexion à la base de données
connectDB();

// Lancer le serveur
const server = app.listen(port, () => {
  console.log(`App running on port ${port} in ${process.env.NODE_ENV} mode.`);
});

// Gestion des erreurs globales
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection: ", err);
  server.close(() => {
    process.exit(1); // Fermer proprement le serveur en cas d'erreur non gérée
  });
});
