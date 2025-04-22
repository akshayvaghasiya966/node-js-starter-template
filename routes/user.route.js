const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, getAllUsers } = require('../controllers/user.controller');
const router = express.Router();
const authorizeRole = require('../middlewares/authorizeRole');
const tryGuard = require('../middlewares/tryCatch');
// Protect this route
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: `Welcome to the Dashboard ${req.user.name}` });
});

// Register Route
router.post('/register', tryGuard(registerUser));

// Login Route
router.post('/login', tryGuard(loginUser));

// Get All User Route
router.get('/getallusers',passport.authenticate('jwt', { session: false }),
authorizeRole('admin','superadmin'), tryGuard(getAllUsers));

// Admin-only route
router.get('/admin',
  passport.authenticate('jwt', { session: false }),
  authorizeRole('admin'),
  (req, res) => {
    res.json({ message: `Welcome to the Admin Dashboard ${req.user.name}` });
  }
);


module.exports = router;
