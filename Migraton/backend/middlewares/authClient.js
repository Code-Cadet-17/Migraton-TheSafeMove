const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const authClient = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await Client.findById(decoded.id);

    if (!client) {
      return res.status(403).json({ message: 'Forbidden: Invalid client' });
    }

    req.client = client; // ✅ attach client to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authClient;
