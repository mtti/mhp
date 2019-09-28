[![npm version](https://badge.fury.io/js/%40mtti%2Fmhp.svg)](https://badge.fury.io/js/%40mtti%2Fmhp)

MHP (**M**atti's **H**ome **P**age) is a static site generator built in TypeScript.

Under early development, the API is likely to change drastically before version 1.0.0.

## Features

* Highly customizable site structure.
* Blog posts and static pages written in Markdown.
* Tags, categories and more thanks to a highly flexible filtering and route generation system.
* Jinja-like [Nunjucks](https://mozilla.github.io/nunjucks/) templates.
* Custom hierarchical template loader which, together with Nunjucks' template inheritance enables a high-degree of reusability with templates.
* Supports [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) to resolve hashed asset files.
* Atom feeds.

## Related

* [mhp-example](https://github.com/mtti/mhp-example) A full example MHP site.
* [ssup](https://github.com/mtti/ssup) A companion utility from the same author for uploading static sites to S3.
