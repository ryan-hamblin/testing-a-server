const mongoose = require('mongoose');
const Band = require('./models');
const server = require('./server');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
chai.use(chaiHTTP);

describe('Band Server', () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/test');
    const db = mongoose.connection;
    db.on('error', () => console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('we are connected');
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe(`[POST] /band`, () => {
    it('should add a new band', done => {
      const myBand = {
        name: 'Radiohead',
        genre: 'Alt-Rock'
      };
      chai
        .request(server)
        .post('/band')
        .send(myBand)
        .end((err, res) => {
          if (err) {
            console.error(err);
            done();
          } //handle error
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Radiohead');
          return done();
        });
    });
  });
});
