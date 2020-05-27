const express = require('express');
const api = express();
const Response = require('./Response');
const { authenticate } = require('../config/auth');

const { getGamesByName } = require('../endpoints/gb/getGamesByName');
const { getGameByGUID } = require('../endpoints/gb/getGameByGUID');

api.post('/getGamesByName', authenticate, (req, res) => {
  getGamesByName(req, res);
});

api.post('/getGameByGUID', authenticate, (req, res) => {
  getGameByGUID(req, res);
});

module.exports = api;
