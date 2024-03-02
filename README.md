[![Written in TypeScript](https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label)](http://www.typescriptlang.org/) [![npm](https://flat.badgen.net/npm/v/@mtti/mhp?icon=npm&label=)](https://www.npmjs.com/package/@mtti/mhp) [![License](https://flat.badgen.net/github/license/mtti/mhp)](https://github.com/mtti/mhp/blob/master/LICENSE)

A static website generator.

In development since 2017, the API is likely to change significantly before version 1.0.0.

## Features

* Highly customizable site structure.
* Supports blog posts and static pages written in Markdown.
* A flexible, code-driven filtering system which decouples the on-disk locations of the output and source files.
* [Nunjucks](https://mozilla.github.io/nunjucks/) templates.
* Hierarchical template loader for improved template reusability across multiple sites.
* Frontend-agnostic.
* Can read `manifest.json` files from [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) and [esbuild-plugin-manifest](https://www.npmjs.com/package/esbuild-plugin-manifest).
* RSS feeds generated with [feed](https://github.com/jpmonette/feed).

## Downsides

* Nonexistent documentation.
* Poor test coverage.
* The API is still in flux.

## License

Copyright &copy;2017 - 2024 Matti Hiltunen, licensed under the Apache License, version 2.0. See [LICENSE](https://github.com/mtti/mhp/blob/master/LICENSE) for details.

### nunjucks-markdown

Contains code from [nunjucks-markdown](https://github.com/zephraph/nunjucks-markdown). Copyright (c) 2014 Justin Bennett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
