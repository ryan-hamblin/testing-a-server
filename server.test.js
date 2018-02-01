const mongoose = require('mongoose');
const Band = require('./models');
const server = require('./server');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
chai.use(chaiHTTP);

describe('Band Server', () => {
  let bandId = null;
  let testBand = null;
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

  beforeEach(done => {
    const myBand = new Band({
      name: 'Radiohead',
      genre: 'Alt-Rock'
    });
    myBand
      .save()
      .then(band => {
        testBand = band;
        bandId = band._id;
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });
  afterEach(done => {
    Band.remove({}, err => {
      if (err) console.error(err);
      done();
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
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Radiohead');
          done();
        });
    });
    it('should send back 422 upon bad data', done => {
      const myBand = {
        dame: 'Radiohead',
        genre: 'Alt-Rock'
      };
      chai
        .request(server)
        .post('/band')
        .send(myBand)
        .end((err, res) => {
          if (err) {
            expect(err.status).to.equal(422);
            const { error } = err.response.body;
            expect(error).to.eql('Invalid input data sent to server');
            done();
          } //handle error
        });
    });
  });

  describe(`[GET] /band`, () => {
    it('should get all bands', done => {
      chai
        .request(server)
        .get('/band')
        .end((err, res) => {
          if (err) {
            throw new Error(err);
            done();
          }
          expect(res.body[0].name).to.eql(testBand.name);
          expect(res.body[0]._id).to.equal(bandId.toString());
          done();
        });
    });
  });

  describe(`[PUT] /band`, () => {
    it('update a document given and id and some text', done => {
      const bandUpdate = {
        id: bandId,
        name: 'Thom York',
        genre: 'FoooRock'
      };
      chai
        .request(server)
        .put('/band')
        .send(bandUpdate)
        .end((err, res) => {
          if (err) {
            throw new Error(err);
            done();
          }
          expect(res.body.name).to.equal(bandUpdate.name);
          expect(res.body.genre).to.equal(bandUpdate.genre);
          done();
        });
    });

    it('handle error if bad id sent', done => {
      const bandUpdate = {
        id: 'asdfasdf',
        name: 'Thom York',
        genre: 'FoooRock'
      };
      chai
        .request(server)
        .put('/band')
        .send(bandUpdate)
        .end((err, res) => {
          if (err) {
            expect(err.status).to.equal(422);
            const { error } = err.response.body;
            expect(error).to.eql('Band not found by that Id');
          }
          done();
        });
    });
  });
});
