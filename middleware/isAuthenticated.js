//importer le modele user
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ error: "Unauthorized / token présent mais non valide" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized / token non envoyé" });
  }
};

module.exports = isAuthenticated;
