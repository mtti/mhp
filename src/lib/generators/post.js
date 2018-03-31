function generatePosts(directory, generatorOptions) {
  if (!directory.slice) {
    return;
  }

  directory.slice.getAll().forEach((post) => {
    const options = {
      vars: {
        post,
        title: post.fields.title,
      },
      type: 'text/html',
      name: `${post.slug}.html`,
    };

    if (generatorOptions.template) {
      options.template = generatorOptions.template;
    }

    const file = directory.addFile(options);

    post.setCanonical(file);
  });
}

module.exports = generatePosts;
