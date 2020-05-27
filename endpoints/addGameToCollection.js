const User = require('../models/User');
const Response = require('../api/Response');
const axios = require('axios');

module.exports = {
  addGameToCollection(req, res) {
    let newGame = {};
    newGame.guid = req.body.game.guid;
    newGame.name = req.body.game.name;
    newGame.platforms = req.body.game.platforms;
    newGame.original_release_date = req.body.game.original_release_date;
    newGame.image = {};
    newGame.image.original_url = req.body.game.image.original_url;
    // User.findOneAndUpdate(
    //   { email: req.session.user },
    //   { $push: { games: newGame, recentlyAdded: newGame } }
    // )
    User.findOne({ email: req.session.user }).then((user) => {
      user.games.unshift(newGame);
      if (user.recentlyAdded.length === 30) {
        user.recentlyAdded.splice(29, 1);
      }
      user.recentlyAdded.unshift(newGame);
      user
        .save()
        .then((response) => {
          res.send(new Response(true));
        })
        .catch((err) => {
          console.log(err);
          res.send(new Response(false));
        });
    });
  }
};
