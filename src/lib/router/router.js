const _ = require('lodash');
const Request = require('./request');
const Response = require('./response');

class Router {
  constructor(site) {
    this._site = site;
  }

  get() {
    let cleanedURI = arguments[0];
    if (cleanedURI.startsWith('/')) {
      cleanedURI = cleanedURI.slice(1);
    }
    const parts = cleanedURI.split('/');

    const callbacks = Array.prototype.slice.call(arguments, 1);
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
      const request = new Request(parts, params);
      const response = new Response(this._site, posts);
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
