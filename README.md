[![Written in TypeScript](https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label)](http://www.typescriptlang.org/) [![npm](https://flat.badgen.net/npm/v/@mtti/mhp?icon=npm&label=)](https://www.npmjs.com/package/@mtti/mhp) [![License](https://flat.badgen.net/github/license/mtti/mhp)](https://github.com/mtti/mhp/blob/master/LICENSE)

A static website generator.

In early development since 2017, the API is likely to change significantly before version 1.0.0.

## Features

* Highly customizable site structure.
* Supports blog posts and static pages written in Markdown.
* A flexible filtering system with an Express-like API decouples the on-disk locations of the output files from the source files.
* [Nunjucks](https://mozilla.github.io/nunjucks/) templates.
* Improved template reusability across multiple sites thanks to a custom hierarchical template loader.
* Frontend-agnostic, but supports [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) to resolve hashed asset files.
* RSS feeds generated with [feed](https://github.com/jpmonette/feed). People still use these, right? Right?

## Downsides

* Nonexistent documentation.
* Poor test coverage.
* The API is still in flux, even though it's beginning to stabilize after three years of development.

## License

Copyright &copy;2017 - 2021 Matti Hiltunen, licensed under the Apache License, version 2.0. See [LICENSE](https://github.com/mtti/mhp/blob/master/LICENSE) for details.

Contains code from [nunjucks-markdown](https://github.com/zephraph/nunjucks-markdown). Copyright (c) 2014 Justin Bennett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
