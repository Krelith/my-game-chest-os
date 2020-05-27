const User = require('../models/User');
const Response = require('../api/Response');

module.exports = {
  removeGameFromCollection(req, res) {
    User.findOne({ email: req.session.user }).then((user) => {
      for (let i = 0; i < user.games.length; i++) {
        if (user.games[i].guid === req.body.guid) {
          user.games.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < user.recentlyAdded.length; i++) {
        if (user.recentlyAdded[i].guid === req.body.guid) {
          user.recentlyAdded.splice(i, 1);
          break;
        }
      }
      user
        .save()
        .then((response) => {
          res.send(
            new Response(true, null, 'Game removed from your collection.')
          );
        })
        .catch((err) => {
          console.log(err);
          res.send(new Response(false, null, 'Could not remove game.'));
        });
    });
  }
};
