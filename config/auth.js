const Response = require('../api/Response');

module.exports = {
  authenticate: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // Proceed
    }
    res.send(new Response(false, null, 'Unauthorised. Login auth failed')); // If auth fails
  }
};
