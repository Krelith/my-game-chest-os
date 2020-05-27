const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Response = require('../api/Response');

const { sendEmail } = require('./sendEmail');

module.exports = {
  changePassword(req, res) {
    User.findOne({ email: req.session.user }).then((user) => {
      bcrypt.compare(
        req.body.currentPassword,
        user.password,
        (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            // Encrypt password and save new user document to DB
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
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
                    console.log('Could not create user: ' + err);
                    res.send(
                      new Response(false, null, 'Error: Could not create user.')
                    );
                  });
              });
            });
          } else {
            res.send(new Response(false, null, 'Invalid current password'));
          }
        }
      );
    });
  }
};
