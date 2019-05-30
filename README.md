MHP (**M**atti's **H**ome **P**age) is a static site generator built in JavaScript with Node.js.

Under early development, the API is likely to change drastically before version 1.0.0.

## Features

* Highly customizable site structure with Express-like routes.
* Blog posts and static pages written in Markdown.
* Tags, categories and more thanks to a highly flexible filtering and route generation system.
* Jinja-like [Nunjucks](https://mozilla.github.io/nunjucks/) templates.
* Custom hierarchical template loader which, together with Nunjucks' template inheritance enables a high-degree of reusability with templates.
* Supports [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) to resolve hashed asset files.
* Atom feeds.

## Project structure

A minimal MHP project would contain the following:

* `/assets` Conventional location for frontend asset source files.
* `/assets/static` Conventional location for static frontend assets.
* `/pages` Pages as front-mattered Markdown files.
* `/posts` Posts as front-mattered Markdown files. Any structure of subdirectories can be used to organize posts. Note that the directory structure of post source files is unrelated to the path their final HTML files are generated at.
* `/templates` Nunjucks template files.
* `/mhp.routes.js`

## Routes

Unlike with many static site generators, in MHP the location of post and page source files on disk is completely unrelated to their locations in the generated site. Posts and pages are treated more or less as data and are generated according to routes defined in the `mhp.routes.js` file in a project's root.

The route file should be a JavaScript module exporting a single function, which accepts the MHP root router as a parameter:

```javascript
module.exports = (router) => {

};
```

While the router is inspired by Express, MHP is a static site generator and therefore the response to every possible request must be pre-generated. Therefore, only `GET` requests are supported and obviously no dynamic server-side features are possible.

For example, to render a page from `project/pages/front.md` as `/index.html`, you could do:

```javascript
module.exports = (router) => {
    router.get('/index.html', (req, res) => res.renderPage('front.md'));
};
```

To generate HTML files for all blog posts under `/blog`, you could do:

```javascript
module.exports = (router) => {
    router.get('/blog/:slug', router.middleware.posts());
};
```

With posts, MHP simulates Express' route parameters by expanding routes like the above with every unique value of the post field specified as the name of the route parameter, in this case `slug`.

The above only generates HTML for the posts themselves. To also generate paged indexes listing the posts, you would do something like this:

```javascript
module.exports = (router) => {
    router.get('/blog/:slug', router.middleware.posts());
    router.get('/blog', router.middleware.indexes());
};
```

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

## Development

MHP has been in "early development" since August 2017 and is likely to remain there for the foreseeable future. Issues, PRs and general feedback are welcome in principle, but for all either of us knows, I might decide to rewrite or break your work the next week so bear that in mind.

### Roadmap

* Test coverage improvements.
* Modernization. MHP has been somewhat of a modern Javascript learning project for me and many legacy relics of that remain which should be refactored.
* Asynchronization. MHP was written to be a synchronous command line utility and should be made asynchronous as much as possible.
* Modularization. It should be made possible to load templates, posts and pages from a database and to emit generated files to a generic interface.
* TypeScript port. Sometime in the far future, I'd like to port the whole thing over to TypeScrip.

## License

Apache License version 2.0. See `LICENSE` file for more information.
