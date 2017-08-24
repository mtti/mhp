const nunjucks = require('nunjucks');

function generatePager(directory, options) {
  const posts = directory.posts;

  if (posts.length === 0) {
    console.error(
      `WARNING Directory ${directory.uri} is generating post indexes but has no posts`);
  }

  const filenamePattern = options.filenamePattern || 'index-{{page}}.html';
  const firstPageFilename = options.firstPageFilename || 'index.html';
  const postsPerPage = options.postsPerPage || 15;
  const totalPages = Math.ceil(posts.length / options.postsPerPage) || 1;

  for (let i = 0; i < totalPages; i += 1) {
    const skip = i * postsPerPage;
    const fileOptions = {
      type: 'text/html',
      name: nunjucks.renderString(filenamePattern, { page: i + 1 }),
      vars: {
        currentPage: i + 1,
        totalPages,
        posts: posts.slice(skip, skip + postsPerPage),
      },
    };

    if (options.template) {
      fileOptions.template = options.template;
    }

    if (i === 0) {
      fileOptions.name = firstPageFilename;
      if (options.firstPageTemplate) {
        fileOptions.template = options.firstPageTemplate;
      }
    }

    directory.addFile(fileOptions);
  }
}

module.exports = generatePager;
