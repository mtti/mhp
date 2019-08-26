const Slice = require('./slice');

function createFakePost(fields) {
  return {
    has: key => !!fields[key],
    get: key => fields[key],
  };
}

const fakePosts = [
  createFakePost({
    someField: 'foo',
  }),
  createFakePost({
    someField: 'bar',
  }),
  createFakePost({
    someField: 'bar',
  }),
  createFakePost({
    someField: 'baz',
  }),
];

function createFakePostDb() {
  return {
    findAll: () => fakePosts,
  };
}

describe('Slice', () => {
  describe('static methods', () => {
    describe('parserFilter()', () => {

    });

    describe('parseSort()', () => {

    });
  });

  describe('instance methods', () => {
    let slice;

    beforeEach(() => {
      slice = new Slice(createFakePostDb());
    });

    describe('length', () => {
      it('returns the same number of posts as parent', () => {
        expect(slice.length).toEqual(fakePosts.length);
      });
    });

    describe('uniqueValues()', () => {
      let result;

      beforeEach(() => {
        result = slice.uniqueValues('someField');
      });

      it('should produce three unique values', () => {
        expect(result.length).toBe(3);
      });

      it('should return expected values', () => {
        expect(result).toEqual(expect.arrayContaining(['foo', 'bar', 'baz']));
      });
    });
  });
});
