const fs = require('fs-extra');
const Loader = require('./loader');
const logger = require('./logger');

jest.mock('fs-extra');
jest.mock('./logger');

describe('Loader', () => {
  let loader;
  let err;
  let result;

  beforeEach(() => {
    loader = new Loader();
    err = undefined;
    result = undefined;
  });

  describe('addPath', () => {
    describe('called with a string', () => {
      beforeEach(() => {
        loader.addPath('/first/path');
        loader.addPath('/second/path');
      });

      it('first added path should be first in _paths array', () => {
        expect(loader._paths[0]).toBe('/first/path');
      });

      it('second added path should be second in _paths array', () => {
        expect(loader._paths[1]).toBe('/second/path');
      });
    });

    describe('called with a non-string', () => {
      beforeEach(() => {
        err = null;
        try {
          loader.addPath({});
        } catch (e) {
          err = e;
        }
      });

      it('throws an exception', () => {
        expect(err).not.toBeNull();
      });
    });
  });

  describe('findTemplate', () => {
    beforeEach(() => {
      loader.addPath('/first');
      loader.addPath('/second');
      loader.addPath('/third');
    });

    describe('when template is not found', () => {
      beforeEach(() => {
        fs.existsSync.mockReturnValue(false);
        logger.error.mockImplementation(() => {});
      });

      beforeEach(() => {
        result = loader.findTemplate('dummy.html');
      });

      it('logs an error', () => {
        expect(logger.error.mock.calls.length).toBe(1);
      });

      it('returns null', () => {
        expect(result).toBeNull();
      });
    });

    describe('when template is found in all paths', () => {
      beforeEach(() => {
        fs.existsSync.mockReturnValue(true);
      });

      beforeEach(() => {
        result = loader.findTemplate('dummy.html');
      });

      it('returns template from last added path', () => {
        expect(result).toBe('/third/dummy.html');
      });
    });

    describe('when template is found in the first and second path', () => {
      beforeEach(() => {
        fs.existsSync.mockImplementation(path => path !== '/third/dummy.html');
      });

      beforeEach(() => {
        result = loader.findTemplate('dummy.html');
      });

      it('returns template from the second added path', () => {
        expect(result).toBe('/second/dummy.html');
      });
    });

    describe('when template is only found in second path', () => {
      beforeEach(() => {
        fs.existsSync.mockImplementation(path => path === '/second/dummy.html');
      });

      beforeEach(() => {
        result = loader.findTemplate('dummy.html');
      });

      it('returns template from the second added path', () => {
        expect(result).toBe('/second/dummy.html');
      });
    });
  });

  describe('getSource', () => {
    describe('when template is found', () => {
      beforeEach(() => {
        loader.findTemplate = jest.fn(() => '/dummy/dummy.html');
        fs.readFileSync.mockImplementation(() => 'TEMPLATE SOURCE CODE');
      });

      afterEach(() => {
        fs.readFileSync.mockRestore();
      });

      beforeEach(() => {
        result = loader.getSource('dummy.html');
      });

      it('calls readFileSync', () => {
        expect(fs.readFileSync.mock.calls.length).toBe(1);
      });

      it('result is an object', () => {
        expect(typeof result).toBe('object');
      });

      it('result contains template source code', () => {
        expect(result.src).toBe('TEMPLATE SOURCE CODE');
      });

      it('result contains template path', () => {
        expect(result.path).toBe('/dummy/dummy.html');
      });
    });

    describe('when template is not found', () => {
      beforeEach(() => {
        loader.findTemplate = jest.fn(() => null);
        fs.readFileSync.mockImplementation(() => null);
      });

      afterEach(() => {
        fs.readFileSync.mockRestore();
      });

      beforeEach(() => {
        result = loader.getSource('dummy.html');
      });

      it('does not call readFileSync', () => {
        expect(fs.readFileSync.mock.calls.length).toBe(0);
      });

      it('returns null', () => {
        expect(result).toBeNull();
      });
    });
  });
});
