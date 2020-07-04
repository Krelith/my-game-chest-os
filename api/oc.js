const express = require('express');
const api = express();
const Response = require('./Response');
const { authenticate } = require('../config/auth');

const { getOpenCriticData } = require('../endpoints/oc/getOpenCriticData');

api.post('/getOpenCriticData', authenticate, (req, res) => {
  getOpenCriticData(req, res);
});

module.exports = api;
