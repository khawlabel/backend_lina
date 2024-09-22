const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const auth = require('./middleware/auth');
// Initialisation des variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

// Initialisation d'Express
const app = express();

// Middleware pour parser les données JSON
app.use(express.json());




// Routes
app.use('/api/users', require('./routes/user'));


app.get('/admin', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  res.send('Welcome Admin');
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
