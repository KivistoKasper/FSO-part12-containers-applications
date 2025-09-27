const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../db/db');
require('dotenv').config();

router.post('/login', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = await User.findOne({ where: { username: username } });

    bcrypt.compare(password, user.password, (error, data) => {
      if (error) throw error;
      if (data) {
        return res.status(200).json({ token: jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: '1h' }) });
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
     }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
