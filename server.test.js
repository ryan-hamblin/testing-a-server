const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
const Band = require('./models');
const server = require('./server');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
chai.use(chaiHTTP);

describe('Band Server', () => {
  describe(`[POST] /band`, () => {
    it('should add a new band', () => {
      const myBand = {
        name: 'Radiohead',
        genre: 'Alt-Rock'
      };
      chai
        .request(server)
        .post('/band')
        .send(myBand)
        .end((err, res) => {
          if (err) console.error(err); //handle error
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Radiohead');
        });
    });
  });
});
