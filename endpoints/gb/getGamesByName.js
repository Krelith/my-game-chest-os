const Response = require('../../api/Response');
const axios = require('axios');

module.exports = {
  getGamesByName(req, res) {
    axios
      .get(
        `https://www.giantbomb.com/api/games/?api_key=${process.env.GIANTBOMB_API_KEY}&format=json&filter=name:${req.body.game}`
      )
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          response.data.error === 'OK'
        ) {
          res.send(new Response(true, response.data.results));
        }
      })
      .catch((err) => console.log(err));
  }
};
