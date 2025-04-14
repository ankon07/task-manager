const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    
    const roles = await Role.find({ _id: { $in: user.roles } }).exec();
    
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === 'admin') {
        next();
        return;
      }
    }
    
    res.status(403).send({ message: 'Require Admin Role!' });
  } catch (err) {
    return res.status(500).send({ message: err.message || 'Error checking admin role.' });
  }
};

module.exports = { verifyToken, isAdmin };
