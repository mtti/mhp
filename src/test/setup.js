const chai = require('chai');
const chaiSubset = require('chai-subset');
const sinon = require('sinon');

global.chai = chai;
chai.use(chaiSubset);
global.sinon = sinon;
global.assert = chai.assert;
global.expect = chai.expect;
sinon.assert.expose(chai.assert, { prefix: '' });

beforeEach(() => {
  global.sandbox = sinon.createSandbox();
});

afterEach(() => {
  global.sandbox.restore();
});
