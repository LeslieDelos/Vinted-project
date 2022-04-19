require("dotenv").config();

//importer les packages
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const morgan = require("morgan");

// se connecter à la BDD
mongoose.connect(process.env.MONGODB_URI);

// création du serveur
const app = express();

//permettre la récupération des paramètre avec methode POST
app.use(formidable());
app.use(morgan("dev"));

//import des routes
const userRoutes = require("./routes/users");
app.use(userRoutes);
const offerRoutes = require("./routes/offers");
app.use(offerRoutes);

//message d'erreur en cas d'acces à une route inexistante
app.all("*", (req, res) => {
  res.status(400).json({ message: error.message });
});

// Utilisez le port défini dans le fichier .env
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
