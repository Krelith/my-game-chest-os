const User = require('../models/User');
const Response = require('../api/Response');

module.exports = {
  updateCollection(req, res) {
    User.findOne({ email: req.session.user })
      .then((user) => {
        user.games.forEach((gameInDb) => {
          if (!gameInDb.toObject().hasOwnProperty('havePlayed')) {
            gameInDb.havePlayed = true;
          } else {
            req.body.games.forEach((gameFromClient) => {
              if (gameInDb.guid === gameFromClient.guid) {
                gameInDb.havePlayed = gameFromClient.havePlayed;
              }
            });
          }
        });
        user.save().then((response) => {
          res.send(new Response(true));
        });
      })
      .catch((err) => {
        console.log(err);
        res.send(new Response(false));
      });
  }
};
