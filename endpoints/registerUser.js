const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Response = require('../api/Response');

module.exports = {
  registerUser(req, res) {
    let userExists = User.exists({ email: req.body.email }).then((response) => {
      if (response) {
        // User already exists
        res.send(new Response(false, null, 'This account already exists.'));
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password,
          games: []
        });

        // Encrypt password and save new user document to DB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((response) => {
                res.send(new Response(true, null, 'Account registered.'));
              })
              .catch((err) => {
                console.log(err);
                res.send(false, null, 'Could not register account.');
              });
          });
        });
      }
    });
  }
};
