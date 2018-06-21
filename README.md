A simple Node.js static site generator with an Express-inspired API, [Nunjucks](https://mozilla.github.io/nunjucks/) templates and Markdown support.

## Project structure

MHP is currently still under early development and a complete template project will be provided when the API stabilizes. For now, a minimal MHP project would contain the following:

* `/assets` Conventional location for frontend asset source files.
* `/assets/static` Conventional location for static frontend assets.
* `/pages` Pages as front-mattered Markdown files.
* `/posts` Posts as front-mattered Markdown files. Any structure of subdirectories can be used to organize posts. Note that the directory structure of post source files is unrelated to the path their final HTML files are generated at.
* `/templates` Nunjucks template files.
* `/mhp.routes.js`

## mhp.routes.js

A minimal routes file exports a callback which receives the MHP router as a parameter:

```javascript
module.exports = (router) => {

};
```

The router's API is inspired by Express. However, since this is a static site generator where the response to every possible request must be pre-generated MHP's API is much more restricted than that of Express. Obviously only GET requests are supported, query strings (e.g. `?foo=bar`) can't be supported, and so on.

For example, to render a page from `project/pages/front.md` as `/index.html`, you could do:

```javascript
module.exports = (router) => {
    router.get('/index.html', (req, res) => res.renderPage('front.md'));
};
```

Note that this will fail if you've not added a default page template at `project/templates/page.html`.

To generate HTML files for all blog posts under `/blog`, you could do:

```javascript
module.exports = (router) => {
    router.get('/blog/:slug', router.middleware.posts());
};
```

With posts, MHP simulates Express' route parameters by expanding routes like the above with every unique value of the post field specified as the name of the route parameter, in this case `slug`.

Also note that this will fail if you've not added a default post template at `project/templates/post.html`.

The above only generates HTML for the posts themselves. To also generate paged indexes listing the posts, you would do something like this:

```javascript
module.exports = (router) => {
    router.get('/blog/:slug', router.middleware.posts());
    router.get('/blog', router.middleware.indexes());
};
```

This will fail if you've not added a default post index template at `project/templates/post-index.html`.

This will generate `/blog/index.html`, `/blog/index-2.html` ... `/blog/index-N.html`. In this case, it's vital that the routes are in this order, as the first path a post is generated at becomes its **canonical location**, which the index pages need to generate links to the posts.

You can also generate an Atom feed of your posts:

```javascript
module.exports = (router) => {
    router.get('/blog/:slug', router.middleware.posts());
    router.get('/blog', router.middleware.indexes());

    const feedOptions = {
        uuid: '69c308f8-18a9-4775-b6ab-34ebc2c3763e',
        title: 'My blog',
    };
    router.get('/blog/atom.xml', router.middleware.atom(feedOptions));
};
```

## Pages

To be added.

## Posts

To be added.

## Templates

To be added.

## Assets

MHP doesn't include a built-in front-end asset pipeline as you're expected to bring your own.

As I use webpack though, MHP does include support for [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) manifest files under `project/dist/assets/manifest.json` so in a template you can use `{{ "main.css"|assetUrl }}` to generate the absolute URL to a hashed file name like `main.6e2bc07f56680f8d4c5b.css` for example.

A full example project with Webpack support will be released once MHP itself stabilizes.

## License

Apache License version 2.0. See `LICENSE` file for more information.
