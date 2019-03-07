const mime = require('mime-types');
const {
  cleanAttributes, replaceExtension, guessMimeType, isInActivePath, mustStartWith, mustEndWith,
  mustNotStartWith, mustNotEndWith, cleanUri,
} = require('./utils');

jest.mock('mime-types');

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
      expect(result).toEqual(expected);
    });
  });

  describe('replaceExtension', () => {
    let result;

    beforeEach(() => {
      result = replaceExtension('/foo/bar/somefile.txt', 'md');
    });

    it('should replace extension', () => {
      expect(result).toBe('/foo/bar/somefile.md');
    });
  });

  describe('guessMimeType', () => {
    let result;

    describe('when filename has no extension', () => {
      beforeEach(() => {
        result = guessMimeType('/foo/bar/somefile');
      });

      it('returns "directory"', () => {
        expect(result).toBe('directory');
      });
    });

    describe('when mime library returns null', () => {
      beforeEach(() => {
        mime.lookup.mockReturnValue(false);
        result = guessMimeType('/foo/bar/somefile.txt');
      });

      it('calls mime.lookup', () => {
        expect(mime.lookup.mock.calls.length).toBe(1);
      });

      it('returns application/octet-stream', () => {
        expect(result).toBe('application/octet-stream');
      });
    });
  });

  describe('isInActivePath', () => {
    let result;

    describe('exact = false', () => {
      it('child is not active on parent page', () => {
        result = isInActivePath('first/second', 'first', false);
        expect(result).toBe(false);
      });

      it('parent is active on child page', () => {
        result = isInActivePath('first', 'first/second', false);
        expect(result).toBe(true);
      });

      it('child is active on its own page', () => {
        result = isInActivePath('first/second', 'first/second', false);
        expect(result).toBe(true);
      });
    });
  });

  describe('mustStartWith', () => {
    const parameters = [
      ['foobar', 'ADD', 'ADDfoobar'],
      ['foo/bar/', '/', '/foo/bar/'],
    ];

    parameters.forEach((item) => {
      const original = item[0];
      const prefix = item[1];
      const expected = item[2];
      it(`add '${prefix}' to '${original}'`, () => {
        const result = mustStartWith(original, prefix);
        expect(result).toBe(expected);
      });
    });
  });

  describe('mustEndWith', () => {
    const parameters = [
      ['foobar', 'ADD', 'foobarADD'],
      ['/foo/bar', '/', '/foo/bar/'],
    ];

    parameters.forEach((item) => {
      const original = item[0];
      const suffix = item[1];
      const expected = item[2];
      it(`remove '${suffix}' from '${original}'`, () => {
        const result = mustEndWith(original, suffix);
        expect(result).toBe(expected);
      });
    });
  });

  describe('mustNotStartWith', () => {
    const parameters = [
      ['REMOVEfoobar', 'REMOVE', 'foobar'],
      ['/foo/bar/', '/', 'foo/bar/'],
    ];

    parameters.forEach((item) => {
      const original = item[0];
      const prefix = item[1];
      const expected = item[2];
      it(`remove '${prefix}' from '${original}'`, () => {
        const result = mustNotStartWith(original, prefix);
        expect(result).toBe(expected);
      });
    });
  });

  describe('mustNotEndWith', () => {
    const parameters = [
      ['foobarREMOVE', 'REMOVE', 'foobar'],
      ['/foo/bar/', '/', '/foo/bar'],
    ];

    parameters.forEach((item) => {
      const original = item[0];
      const suffix = item[1];
      const expected = item[2];
      it(`remove '${suffix}' from '${original}'`, () => {
        const result = mustNotEndWith(original, suffix);
        expect(result).toBe(expected);
      });
    });
  });

  describe('cleanUri', () => {
    const parameters = [
      ['/index.html', ''],
      ['index.html', ''],
      ['foo.html', 'foo'],
      ['subdir/index.html', 'subdir'],
      ['subdir/foo.html', 'subdir/foo'],
      ['/subdir/index.html', 'subdir'],
      ['/subdir/foo.html', 'subdir/foo'],

      ['/readme.txt', 'readme.txt'],
      ['readme.txt', 'readme.txt'],
      ['subdir/foo.pdf', 'subdir/foo.pdf'],
    ];

    parameters.forEach((item) => {
      const original = item[0];
      const expected = item[1];
      it(`with ${original}`, () => {
        const result = cleanUri(original);
        expect(result).toBe(expected);
      });
    });
  });
});
