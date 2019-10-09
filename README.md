[![Written in TypeScript](https://flat.badgen.net/badge/icon/typescript?icon=typescript&label)](http://www.typescriptlang.org/) [![npm](https://flat.badgen.net/npm/v/@mtti/mhp?icon=npm)](https://www.npmjs.com/package/@mtti/mhp) [![Travis](https://flat.badgen.net/travis/mtti/mhp?icon=travis)](https://travis-ci.org/mtti/mhp) [![License](https://flat.badgen.net/github/license/mtti/mhp)](https://github.com/mtti/mhp/blob/master/LICENSE)

A static website generator built in TypeScript.

Under early development, the API is likely to change drastically before version 1.0.0.

## Features

* Highly customizable site structure.
* Blog posts and static pages written in Markdown.
* Tags, categories and more thanks to a highly flexible filtering and route generation system.
* [Nunjucks](https://mozilla.github.io/nunjucks/) templates.
* Custom hierarchical template loader which, together with Nunjucks' template inheritance enables a high-degree of reusability with templates.
* Supports [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) to resolve hashed asset files.
* Atom and RSS feeds generated with [feed](https://github.com/jpmonette/feed).

## Related

* [mhp-example](https://github.com/mtti/mhp-example) A full example MHP site.
* [ssup](https://github.com/mtti/ssup) A companion utility from the same author for uploading static sites to S3.

## License

Copyright &copy;2019 Matti Hiltunen, licensed under the Apache License, version 2.0. See [LICENSE](https://github.com/mtti/mhp/blob/master/LICENSE) for details.

Contains code from [nunjucks-markdown](https://github.com/zephraph/nunjucks-markdown). Copyright (c) 2014 Justin Bennett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
