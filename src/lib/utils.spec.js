const mime = require('mime-types');
const {
  cleanAttributes, replaceExtension, guessMimeType, isInActivePath,
} = require('./utils');

describe('utils', () => {
  describe('cleanAttributes', () => {
    const original = {
      first: 1,
      _second: 2,
      _third: 3,
      fourth: 4,
    };
    const expected = {
      first: 1,
      second: 2,
      third: 3,
      fourth: 4,
    };
    let result;

    beforeEach(() => {
      result = cleanAttributes(original);
    });

    it('should produce the expected result', () => {
      assert.deepEqual(result, expected);
    });
  });

  describe('replaceExtension', () => {
    let result;

    beforeEach(() => {
      result = replaceExtension('/foo/bar/somefile.txt', 'md');
    });

    it('should replace extension', () => {
      assert.equal(result, '/foo/bar/somefile.md');
    });
  });

  describe('guessMimeType', () => {
    let result;

    describe('when filename has no extension', () => {
      beforeEach(() => {
        result = guessMimeType('/foo/bar/somefile');
      });

      it('returns "directory"', () => {
        assert.equal(result, 'directory');
      });
    });

    describe('when mime library returns null', () => {
      let lookup;

      beforeEach(() => {
        lookup = sandbox.stub(mime, 'lookup').returns(false);
        result = guessMimeType('/foo/bar/somefile.txt');
      });

      it('calls mime.lookup', () => {
        assert.equal(lookup.called, true);
      });

      it('returns application/octet-stream', () => {
        assert.equal(result, 'application/octet-stream');
      });
    });
  });

  describe('isInActivePath', () => {
    let result;

    describe('exact = false', () => {
      it('child is not active on parent page', () => {
        result = isInActivePath('first/second', 'first', false);
        assert.equal(result, false);
      });

      it('parent is active on child page', () => {
        result = isInActivePath('first', 'first/second', false);
        assert.equal(result, true);
      });

      it('child is active on its own page', () => {
        result = isInActivePath('first/second', 'first/second', false);
        assert.equal(result, true);
      });
    });
  });
});
