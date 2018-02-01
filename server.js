const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Band = require('./models');

const server = express();
server.use(morgan('combined'));
server.use(bodyParser.json());

server.get('/band', (req, res) => {
  Band.find({}, (err, bands) => {
    if (err) res.status(422).json(err);
    res.json(bands);
  });
});

server.post('/band', (req, res) => {
  const { name, genre } = req.body;
  const myNewBand = new Band({ name, genre });
  myNewBand
    .save()
    .then(band => {
      res.json(band);
    })
    .catch(err => {
      res.status(422);
      res.json({ error: 'Invalid input data sent to server' });
    });
});

module.exports = server;
