const express = require('express');
const router = express.Router();

// API Registrasi
router.post('/register', (req, res) => {
  const { email,firstname, lastname, password } = req.body;
  // Tambahkan logika Firebase Authentication untuk registrasi
  res.status(200).json({ success: true, message: 'User registered successfully' });
});

// API Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Tambahkan logika Firebase Authentication untuk login
  res.status(200).json({ success: true, message: 'User logged in successfully' });
});

module.exports = router;
