const PostDb = require('./post-db');
const utils = require('../utils');

jest.mock('../utils');

describe('PostDb', () => {
  let postDb;

  beforeEach(() => {
    postDb = new PostDb();
  });

  describe('load', () => {
  });

  describe('loadDirectory', () => {
    let subdirectoryObj;
    let fileObj;
    let loadDirectorySpy;

    beforeEach(() => {
      subdirectoryObj = {
        path: '/directory/subdirectory',
        stat: {
          isDirectory: jest.fn().mockReturnValue(true),
          isFile: jest.fn().mockReturnValue(false),
        },
        extension: '',
      };

      fileObj = {
        path: '/directory/file.md',
        stat: {
          isDirectory: jest.fn().mockReturnValue(false),
          isFile: jest.fn().mockReturnValue(true),
        },
        extension: '.md',
      };

      utils.readDirectory.mockImplementation((directoryPath) => {
        if (directoryPath === '/directory') {
          return Promise.resolve([subdirectoryObj, fileObj]);
        }
        if (directoryPath === '/directory/subdirectory') {
          return Promise.resolve([]);
        }
        throw new Error(`Mock called with unexpected parameter: ${directoryPath}`);
      });

      loadDirectorySpy = jest.spyOn(postDb, 'loadDirectory');

      postDb.load = jest.fn().mockResolvedValue({});
    });

    afterEach(() => {
      utils.readDirectory.mockReset();
    });

    beforeEach(async () => {
      await postDb.loadDirectory('/directory');
    });

    it('calls readDirectory with root directory', () => {
      expect(utils.readDirectory).toHaveBeenCalledWith('/directory');
    });

    it('calls readDirectory with subdirectory', () => {
      expect(utils.readDirectory).toHaveBeenCalledWith('/directory/subdirectory');
    });

    it('calls postDb.load with file', () => {
      expect(postDb.load).toHaveBeenCalledWith('/directory/file.md');
    });

    it('calls itself with subdirectory', () => {
      expect(loadDirectorySpy).toHaveBeenCalledWith('/directory/subdirectory');
    });

    it('checks subdirectory stat', () => {
      expect(subdirectoryObj.stat.isDirectory).toHaveBeenCalled();
    });

    it('checks file stat', () => {
      expect(subdirectoryObj.stat.isFile).toHaveBeenCalled();
    });
  });

  describe('slice', () => {

  });
});
