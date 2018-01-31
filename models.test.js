const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
const Band = require('./models');

const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');

describe('Bands', () => {
  describe('#getBandName', () => {
    it('should give back the proper band.name', () => {
      const band = new Band({
        name: 'Modest Mouse',
        genre: 'Alternative'
      });
      expect(band.getBandName()).to.equal('Modest Mouse');
    });
  });

  describe('#getAllBands()', () => {
    it('should return all the bands', () => {
      sinon.stub(Band, 'find');
      Band.find.yields(null, [{ name: 'Modest Mouse', genre: 'Alternative' }]);
      Band.getAllBands(returnObject => {
        expect(returnObject.length).to.equal(1);
        expect(returnObject[0].name).to.equal('Modest Mouse');
        Band.find.restore();
      });
    });
  });
});
