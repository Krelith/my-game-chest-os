const express = require('express');
const api = express();
const session = require('express-session');
const passport = require('passport');
const Response = require('./Response');
const { registerUser } = require('../endpoints/registerUser');
const { changePassword } = require('../endpoints/changePassword');
const { sendResetLink } = require('../endpoints/sendResetLink');
const { resetPassword } = require('../endpoints/resetPassword');
const { addGameToCollection } = require('../endpoints/addGameToCollection');
const { getUserCollection } = require('../endpoints/getUserCollection');
const { getUserPlatforms } = require('../endpoints/getUserPlatforms');
const { getGameByGUIDLocal } = require('../endpoints/getGameByGUIDLocal');
const {
  removeGameFromCollection
} = require('../endpoints/removeGameFromCollection');
const { updatePlatforms } = require('../endpoints/updatePlatforms');
const { updateCollection } = require('../endpoints/updateCollection');

require('dotenv').config();

// Express session config
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session expires after 24 hours
};

// Enable Passport
require('../config/passport')(passport);

// Enable session (server) using config
api.use(session(sessionConfig));

// Passport middleware (client session)
api.use(passport.initialize());
api.use(passport.session());

const { authenticate } = require('../config/auth');

// Logout handler
api.get('/logout', (req, res) => {
  // End server-side session
  req.session.destroy();
  // Execute logout
  req.logout();
  // Send confirm response to client for view change and state reset
  res.send(new Response(true));
});

// Login handler
api.post('/login', (req, res, next) => {
  // Authenticate credentials against database
  passport.authenticate('local', (err, user, info) => {
    // Check process errors
    if (err) {
      return next(err);
    }
    // User failed auth
    if (!user) {
      res.send(
        new Response(false, null, info ? info.message : 'Invalid credentials')
      );
      return;
    }
    // Execute login
    req.login(user, (err) => {
      res.send(new Response(true, user));
    });
  })(req, res, next);
});

api.post('/registerUser', (req, res) => {
  registerUser(req, res);
});

api.post('/changePassword', authenticate, (req, res) => {
  changePassword(req, res);
});

api.post('/sendResetLink', (req, res) => {
  sendResetLink(req, res);
});

api.post('/resetPassword', (req, res) => {
  resetPassword(req, res);
});

api.get('/loginAuth', authenticate, (req, res) => {
  // Checks user is logged in when routing between views
  res.send(new Response(true));
});

api.post('/addGameToCollection', authenticate, (req, res) => {
  addGameToCollection(req, res);
});

api.post('/getUserCollection', authenticate, (req, res) => {
  getUserCollection(req, res);
});

api.get('/getUserPlatforms', authenticate, (req, res) => {
  getUserPlatforms(req, res);
});

api.post('/getGameByGUIDLocal', authenticate, (req, res) => {
  getGameByGUIDLocal(req, res);
});

api.post('/removeGameFromCollection', authenticate, (req, res) => {
  removeGameFromCollection(req, res);
});

api.post('/updatePlatforms', authenticate, (req, res) => {
  updatePlatforms(req, res);
});

api.post('/updateCollection', (req, res) => {
  updateCollection(req, res);
});

module.exports = api;
