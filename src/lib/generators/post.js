function generatePosts(directory, generatorOptions) {
  if (!directory.slice) {
    return;
  }

  directory.slice.execute().forEach((post) => {
    const options = {
      vars: {
        post,
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
