const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { randomUUID } = require('crypto');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const userId = randomUUID();
    db.prepare(`INSERT INTO app_users (user_id, user_email, user_password) VALUES (?, ?, ?)`).run(userId, email, hashed);
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Signup successful', token });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM app_users WHERE user_email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.user_password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.user_id, email: user.user_email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = router;
module.exports.authenticateToken = authenticateToken;
