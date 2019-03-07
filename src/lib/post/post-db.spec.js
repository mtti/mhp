const fs = require('fs-extra');
const PostDb = require('./post-db');

jest.mock('fs-extra');

describe('PostDb', () => {
  describe('_checkFileType', () => {
    const dummyFile = {
      path: '/dummy',
    };

    let result;

    describe('called with a path to a file', () => {
      beforeEach(() => {
        fs.stat.mockResolvedValue({
          isFile: () => true,
          isDirectory: () => false,
        });
      });

      beforeEach(async () => {
        result = await PostDb._checkFileType(dummyFile);
      });

      it('creates a new object', () => {
        expect(result).not.toBe(dummyFile);
      });

      it('sets type as "file"', () => {
        expect(result.type).toBe('file');
      });
    });

    describe('called with a path to a directory', () => {
      beforeEach(() => {
        fs.stat.mockResolvedValue({
          isFile: () => false,
          isDirectory: () => true,
        });
      });

      beforeEach(async () => {
        result = await PostDb._checkFileType(dummyFile);
      });

      it('creates a new object', () => {
        expect(result).not.toBe(dummyFile);
      });

      it('sets type as "directory"', () => {
        expect(result.type).toBe('directory');
      });
    });
  });
});
