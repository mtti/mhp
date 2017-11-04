# MHP

Simple static site generator. Write your posts in front-mattered Markdown. Define the structure of your site in a YAML file. Select which posts belong to which directories with simple filters. Then configure these directories to use *generators* to output posts as HTML and to generate paginated post indexes or Atom feeds.

MHP uses [Nunjucks](https://mozilla.github.io/nunjucks/) templates. Use whatever preprocessors you want for your CSS and JavaScript. Or dont'. MHP doesn't care.

## Command line interface

Usage: `mhp COMMAND [OPTIONS]`.

Commands:

* `generate` The default if no command is given. Generate an MHP site in the current working directory.
* `init` Create a base MHP project in the current working directory.
    * `--overwrite` Overwrite existing files with their base versions. This is intended for use in MHP's development, you probably won't need it.
* `serve` Start a HTTP server to serve the contents of the output directory.
    * `--port` The port to listen on. Optional. Defaults to `8080`.

## Project structure

Use `mhp init` to generate a basic project for you. Or look in the `base` directory in this repository since all the init command does is copy the contents of that directory to your current working directory.

* `/posts` Put you posts here as Markdown files.
* `/templates` Put your Nunjucks templates here.
* `/mhp.yml` Defines the structure of your site.

## License

Apache License version 2.0. See `LICENSE` file for more information.
