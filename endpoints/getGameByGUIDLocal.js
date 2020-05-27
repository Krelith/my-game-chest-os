const User = require('../models/User');
const Response = require('../api/Response');

module.exports = {
  getGameByGUIDLocal(req, res) {
    User.findOne({ email: req.session.user })
      .then((user) => {
        let foundGame = false;
        for (let i = 0; i < user.games.length; i++) {
          // Use a for loop instead of forEach (which cannot be stopped with a return statement)
          if (user.games[i].guid === req.body.guid) {
            foundGame = true;
            res.send(new Response(true, user.games[i]));
            return;
          }
        }
        if (!foundGame) {
          res.send(new Response(false, null, 'Cannot find this game.'));
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(new Response(false, null, 'Unable to find user profile.'));
      });
  }
};
