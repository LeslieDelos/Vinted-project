//importer les packages
const express = require("express");
const router = express.Router();

//authentification
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//import du modèle User
const User = require("../models/User");

//premiere route, créer un nouveau compte si email pas déjà utilisé
router.post("/vinted/user/signup", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.fields.email });

    if (userExist) {
      res.status(400).json({ message: "Le mail existe déjà" });
    } else if (!req.fields.username) {
      res.status(400).json({ message: "Il manque un pseudo" });
    } else {
      const salt = uid2(32);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(16);
      const newUser = new User({
        email: req.fields.email,
        account: {
          username: req.fields.username,
          avatar: Object, // nous verrons plus tard comment uploader une image
        },
        newsletter: req.fields.newsletter,
        token: token,
        hash: hash,
        salt: salt,
      });
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        token: newUser.token,
        account: newUser.account,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//deuxieme route pour la connection
router.post("/vinted/user/login", async (req, res) => {
  try {
    const userToCheck = await User.findOne({ email: req.fields.email });
    if (userToCheck === null) {
      res.status(401).json({ message: "Unauthorized ! 1" });
    } else {
      const newHash = SHA256(req.fields.password + userToCheck.salt).toString(
        encBase64
      );
      if (userToCheck.hash === newHash) {
        res.json({
          _id: userToCheck._id,
          token: userToCheck.token,
          account: userToCheck.account,
        });
      } else {
        res.status(401).json({ message: "Unauthorized ! 2" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
