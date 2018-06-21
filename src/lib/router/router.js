const _ = require('lodash');
const middleware = require('../middleware');
const Request = require('./request');
const Response = require('./response');

class Router {
  get middleware() {
    return middleware;
  }

  get globals() {
    return Object.assign({}, this._globals, this._lockedGlobals);
  }

  constructor(site, options = {}) {
    this._site = site;
    this._globals = {
      lang: 'en',
      assetManifest: site.assetManifest,
    };

    this._lockedGlobals = {};
    if (options.baseUrl) {
      this._lockedGlobals.baseUrl = options.baseUrl;
    }
  }

  setGlobal(key, value) {
    this._globals[key] = value;
  }

  setGlobals(obj) {
    _.merge(this._globals, obj);
  }

  get(...args) {
    let cleanedURI = args[0];
    if (cleanedURI.startsWith('/')) {
      cleanedURI = cleanedURI.slice(1);
    }
    const parts = cleanedURI.split('/');

    const callbacks = Array.prototype.slice.call(args, 1);
    return this._generate(parts, callbacks);
  }

  _generate(parts, callbacks, postSet, params = {}) {
    let posts;
    if (postSet) {
      posts = postSet;
    } else {
      posts = this._site.postDb.slice();
    }

    // Run callbacks when there are no more parameter expansions to be done in the path
    const groupCount = parts.filter(item => item.startsWith(':')).length;
    if (groupCount === 0) {
      const request = new Request(this._site, parts, params);
      const response = new Response(this._site, this.globals, request, posts);
      callbacks.forEach((callback) => {
        callback(request, response);
      });
      return;
    }

    const path = [];
    parts.forEach((item, i) => {
      if (item.startsWith(':')) {
        const fieldName = item.slice(1);
        posts
          .groupBy(fieldName)
          .forEach((pair) => {
            const pathCopy = path.slice();
            const paramsCopy = _.cloneDeep(params);

            pathCopy.push(pair[0]);
            Array.prototype.push.apply(pathCopy, parts.slice(i + 1));

            paramsCopy[fieldName] = pair[0];

            this._generate(pathCopy, callbacks, pair[1], paramsCopy);
          });
      } else {
        path.push(item);
      }
    });
  }
}

module.exports = Router;
