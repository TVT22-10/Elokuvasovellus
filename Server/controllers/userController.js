const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.register = async (req, res) => {
  try {
    // Tässä kohtaa tulisi lisätä salasanan hashays
    const user = await User.create(req.body.username, req.body.password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    // Tässä kohtaa toteutetaan käyttäjän todennus ja tokenin luonti
    const user = await User.findByUsername(req.body.username);
    if (user && user.password === req.body.password) {
      // Tässä kohdassa oletetaan, että salasanat täsmäävät suoraan, mutta todellisuudessa tulisi käyttää salasanan vertailuun sopivaa funktiota
      res.json({ message: "Kirjautuminen onnistui" });
    } else {
      res.status(400).send("Virheellinen käyttäjätunnus tai salasana");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Päivitä käyttäjätietoja
    const updatedUser = await User.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.send({ message: "Käyttäjä poistettu" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};