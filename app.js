const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const apiAccounts = require('./api/accounts');
const apiGiantBomb = require('./api/gb');

const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Custom API libraries
app.use(apiAccounts);
app.use(apiGiantBomb);

// Serve from dist folder for build testing and prod
app.use(express.static(path.join(__dirname, 'client/dist')));

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => console.error('Cannot connect to DB. ' + err));

mongoose.set('useFindAndModify', false);

// Listen
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
