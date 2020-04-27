const {
  rss,
  branch,
  indexes,
  posts,
  page,
  vars,
} = require('@mtti/mhp');

module.exports = {
  routes: [
    vars({
      siteTitle: 'MHP Test Site',
      baseUrl: 'http://127.0.0.1',
      lang: 'en',
    }),

    branch('/posts/:category/:slug', posts()),
    branch('/', indexes()),

    branch('/feed.rss.xml', rss({
      uuid: '120024cf-8721-4492-b4de-eb6847c92abb',
      title: 'MHP Test Site Main Atom Feed',
      maxPosts: 50,
    })),

    branch('/about.html', page('about.md')),
  ],
};
