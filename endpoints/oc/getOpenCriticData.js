const axios = require('axios');
const Response = require('../../api/Response');
const { evalNumerals } = require('./evalNumerals');

module.exports = {
  getOpenCriticData(req, res) {
    // Interrogate search using GB game name
    axios
      .get(
        `https://api.opencritic.com/api/game/search/?criteria=${req.body.game}`
      )
      .then((response) => {
        // Got a response
        if (
          response &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // Got some results, check them for a complete match
          let gotGame = false;

          if (response.data[0].dist > 0) {
            let useBestGuess = evalNumerals(
              req.body.game,
              response.data[0].name
            );
            if (useBestGuess) {
              response.data[0].dist = 0;
            }
          }

          if (response.data[0].dist === 0) {
            // Got a match
            gotGame = true;
            let ocid = response.data[0].id;
            // Query OC DB for the precise game ID
            axios
              .get(`https://api.opencritic.com/api/game/${ocid}`)
              .then((response) => {
                // Got response
                if (response && response.data) {
                  let openCriticData = {
                    name: '',
                    averageScore: '',
                    trailers: [],
                    screenshots: []
                  };
                  // Check for the data we need to retrieve and set it in the response object accordingly, with fallbacks
                  if (
                    response.data.hasOwnProperty('averageScore') &&
                    response.data.averageScore >= 0
                  ) {
                    openCriticData.averageScore = Math.round(
                      response.data.averageScore
                    ).toString();
                  } else {
                    openCriticData.averageScore = 'No reviews available.';
                  }
                  if (
                    response.data.hasOwnProperty('trailers') &&
                    Array.isArray(response.data.trailers) &&
                    response.data.trailers.length > 0
                  ) {
                    openCriticData.trailers = response.data.trailers;
                  }
                  if (
                    response.data.hasOwnProperty('screenshots') &&
                    Array.isArray(response.data.screenshots) &&
                    response.data.screenshots.length > 0
                  ) {
                    if (response.data.screenshots.length > 3) {
                      for (let i = 0; i < 3; i++) {
                        openCriticData.screenshots.push(
                          response.data.screenshots[i]
                        );
                      }
                    } else {
                      openCriticData.screenshots = response.data.screenshots;
                    }
                  }
                  res.send(new Response(true, openCriticData));
                } else {
                  res.send(new Response(false));
                }
              })
              .catch((err) => {
                console.log(err);
                res.send(new Response(false));
              });
          }

          if (!gotGame) {
            let bestMatch = response.data[0];
            // Method to determine if OC's best guess is good enough
          }

          if (!gotGame) {
            res.send(new Response(false));
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(new Response(false));
      });
  }
};
