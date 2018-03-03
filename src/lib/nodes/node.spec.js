const DirectoryNode = require('./directory-node');
const FileNode = require('./file-node');

describe('Node', () => {
  describe('breadcrumbs', () => {
    let result;

    describe('when node is a directory', () => {
      let directory;

      beforeEach(() => {
        directory = new DirectoryNode(null, {}, null);
      });

      describe('without an index', () => {
        beforeEach(() => {
          result = directory.breadcrumbs;
        });

        it('returns no breadcrumbs', () => {
          expect(result.length).to.equal(0);
        });
      });

      describe('with an index', () => {
        let index;

        beforeEach(() => {
          index = directory.addFile({
            name: 'index.html',
          });
        });

        beforeEach(() => {
          result = directory.breadcrumbs;
        });

        it('returns a single breadcrumb', () => {
          expect(result.length).to.equal(1);
        });

        it('returned breadcrumb is the index page node', () => {
          expect(result[0]).to.eql(index);
        });
      });
    });

    describe('when node is a file', () => {
      let file;

      describe('when file is named index.html', () => {
        beforeEach(() => {
          file = new FileNode(null, { name: 'index.html' });
        });

        beforeEach(() => {
          result = file.breadcrumbs;
        });

        it('returns no breadcrumbs', () => {
          expect(result.length).to.equal(0);
        });
      });

      describe('when node is a normal page', () => {
        beforeEach(() => {
          file = new FileNode(null, { name: 'some-page.html' });
        });

        beforeEach(() => {
          result = file.breadcrumbs;
        });

        it('returns a single breadcrumb', () => {
          expect(result.length).to.equal(1);
        });

        it('returned breadcrumb is the same file node', () => {
          expect(result[0]).to.eql(file);
        });
      });
    });
  });
});
