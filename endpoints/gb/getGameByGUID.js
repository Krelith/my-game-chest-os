const Response = require('../../api/Response');
const axios = require('axios');

module.exports = {
  getGameByGUID(req, res) {
    axios
      .get(
        `https://www.giantbomb.com/api/game/${req.body.guid}/?api_key=${process.env.GIANTBOMB_API_KEY}&format=json&field_list=name,guid,image,deck,original_release_date,platforms,developers,publishers,genres`
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
