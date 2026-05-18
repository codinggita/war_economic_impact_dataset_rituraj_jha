const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: 'JWT Profile accessed' });
});

router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({ message: 'JWT Dashboard accessed' });
});

router.post('/generate-token', (req, res) => {
  // dummy endpoint
  res.status(200).json({ message: 'Token generated' });
});

router.post('/verify-token', protect, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});

router.post('/refresh-token', protect, (req, res) => {
  res.status(200).json({ message: 'Token refreshed' });
});

router.get('/admin', protect, admin, (req, res) => {
  res.status(200).json({ message: 'Admin access granted' });
});

router.get('/user', protect, (req, res) => {
  res.status(200).json({ message: 'User access granted' });
});

router.delete('/logout', protect, (req, res) => {
  res.status(200).json({ message: 'JWT session logged out' });
});

module.exports = router;
