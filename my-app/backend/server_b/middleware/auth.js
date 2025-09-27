const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required' });
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid Authrorization header' });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authentication;
