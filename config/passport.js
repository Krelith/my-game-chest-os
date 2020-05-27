// Load dependencies
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req, email, password, done) => {
        // Match user
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false);
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                // Set session data for future comparison against client session, ensuring no tampering on client side
                req.session.user = user.email;
                return done(null, user);
              } else {
                done(null, false, { message: 'Invalid credentials.' });
              }
            });
          })
          .catch((err) => console.error(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) throw err;
      done(null, user);
    });
  });
};
