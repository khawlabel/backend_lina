const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Route pour créer un compte utilisateur
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    // Vérification si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Création d'un nouvel utilisateur
    user = new User({
      firstname,
      lastname,
      email,
      password: await bcrypt.hash(password, 10), // Hashage du mot de passe
      role
    });

    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Route pour login utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Vérification si l'utilisateur existe
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Création d'un token JWT
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, // Token expire après 1 heure
        (err, token) => {
          if (err) throw err;
  
          // Renvoyer le token et les informations de l'utilisateur
          res.json({
            token,
            user: {
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              role: user.role,
            }
          });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

module.exports = router;
