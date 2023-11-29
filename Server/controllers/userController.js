const User = require('./models/user');
const bcrypt = require('bcrypt');

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
    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); // 10 is the salt rounds

    // Use the hashed password when creating the new user
    const user = await User.create(req.body.username, hashedPassword);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByUsername(req.body.username);
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      // Assuming user object contains creation_time
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY);
      res.json({ jwtToken: token, userData: user });
    } else {
      res.status(400).send("Invalid username or password");
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