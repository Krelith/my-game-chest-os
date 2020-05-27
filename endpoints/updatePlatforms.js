const User = require('../models/User');
const Response = require('../api/Response');

module.exports = {
  updatePlatforms(req, res) {
    User.findOne({ email: req.session.user })
      .then((user) => {
        for (let i = 0; i < user.games.length; i++) {
          if (user.games[i].guid === req.body.guid) {
            user.games[i].platforms = req.body.platforms;
            break;
          }
        }
        user
          .save()
          .then((response) => {
            res.send(new Response(true, null, 'Platforms updated.'));
          })
          .catch((err) => res.send(new Response(false, null, 'Server error.')));
      })
      .catch((err) => res.send(new Response(false, null, 'Server error.')));
  }
};
