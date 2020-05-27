const User = require('../models/User');
const Code = require('../models/Code');
const Response = require('../api/Response');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('./sendEmail');

module.exports = {
  resetPassword(req, res) {
    Code.exists({ code: req.body.code })
      .then((exists) => {
        if (!exists) {
          res.send(
            new Response(
              false,
              null,
              'Your reset link is invalid or has expired.'
            )
          );
        } else {
          Code.findOne({ code: req.body.code })
            .then((codeEntry) => {
              User.findOne({ email: codeEntry.email })
                .then((user) => {
                  // Encrypt password and save new user document to DB
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                      if (err) throw err;
                      user.password = hash;
                      user
                        .save()
                        .then((response) => {
                          sendEmail(
                            user.email,
                            'My Game Chest password has been changed',
                            `Your password has been changed. If this was not you, you can reset your password by clicking 'FORGOT MY PASSWORD' at <a href="${process.env.APP_URL}">mygamechest.com</a>.<br /><br />Regards,<br />My Game Chest`
                          );
                          res.send(
                            new Response(
                              true,
                              null,
                              'Your password has been changed.'
                            )
                          );
                        })
                        .catch((err) => {
                          console.log(err);
                          res.send(new Response(false, null, 'Server error.'));
                        });
                    });
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.send(new Response(false, null, 'Server error.'));
                });
            })
            .catch((err) => {
              console.log(err);
              res.send(new Response(false, null, 'Server error.'));
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(new Response(false, null, 'Server error.'));
      });
  }
};
