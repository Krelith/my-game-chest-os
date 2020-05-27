const User = require('../models/User');
const Response = require('../api/Response');

module.exports = {
  getUserCollection(req, res) {
    User.findOne({ email: req.session.user })
      .then((user) => {
        let results = []; // Init the array to be returned

        // Get the total games to filter through with additional filters
        switch (req.body.collection) {
          case 'Recently added':
            results = user.recentlyAdded;
            break;
          case 'All':
            results = user.games;
            // Check there isn't a space at the start of the game's name (F1 2019!!!)
            results.forEach((result) => {
              if (result.name[0] === ' ') {
                result.name = result.name.replace(/\s/, '');
              }
            });
            break;
        }

        switch (req.body.platform) {
          case 'All':
            // No additional filtering required
            break;
          default:
            // Account for supplied platform (could be anything)
            for (let i = results.length - 1; i >= 0; i--) {
              let gameIsValid = false;
              if (
                Array.isArray(results[i].platforms) &&
                results[i].platforms.length > 0
              ) {
                for (let j = 0; j < results[i].platforms.length; j++) {
                  if (
                    results[i].platforms[j].owned &&
                    results[i].platforms[j].name === req.body.platform
                  ) {
                    gameIsValid = true;
                    break;
                  }
                }
              }
              if (!gameIsValid) {
                results.splice(i, 1);
              }
            }
        }
        res.send(new Response(true, results));
      })
      .catch((err) => {
        console.log(err);
        res.send(new Response(false, null, 'Unable to find user.'));
      });
  }
};
