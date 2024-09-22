const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Récupérer le token depuis le header
  const token = req.header('Authorization');

  // Vérifier s'il n'y a pas de token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
