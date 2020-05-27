const User = require('../models/User');
const Response = require('../api/Response');

module.exports = {
  getUserPlatforms(req, res) {
    // console.log('Getting platforms');
    User.findOne({ email: req.session.user })
      .then((user) => {
        let platforms = ['All'];
        if (user.games.length > 0) {
          user.games.forEach((game) => {
            if (Array.isArray(game.platforms) && game.platforms.length > 0) {
              game.platforms.forEach((platform) => {
                if (platform.owned && !platforms.includes(platform.name)) {
                  platforms.push(platform.name);
                }
              });
            }
          });
        }
        res.send(new Response(true, platforms));
      })
      .catch((err) => console.log(err));
  }
};
