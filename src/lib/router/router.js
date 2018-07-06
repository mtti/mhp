const _ = require('lodash');
const Request = require('./request');
const Response = require('./response');

class Router {
  /**
   * The list of middleware callbacks from this router and its parents in the orher they were
   * defined.
   */
  get middleware() {
    const middleware = [];
    if (this._parent !== null) {
      middleware.push(...this._parent.middleware);
    }
    middleware.push(...this._middleware);
    return middleware;
  }

  /**
   * All global template variables for this router, including variables inherited from parent
   * routers.
   */
  get globals() {
    const globals = {};
    if (this._parent !== null) {
      Object.assign(globals, this._parent.globals);
    }
    return Object.assign(globals, this._globals, this._lockedGlobals);
  }

  get site() {
    return this._site;
  }

  constructor(options = {}) {
    this._globals = {
      lang: 'en',
    };

    const globals = options.globals || {};
    Object.assign(this._globals, globals);

    this._children = [];
    this._pathPrefix = '';
    this._middleware = [];
    this._routes = [];

    this._lockedGlobals = {};
    if (options.baseUrl) {
      this._lockedGlobals.baseUrl = options.baseUrl;
    }
  }

  /**
   * Set the value of an individual global template variable. Values set on a router override values
   * inherited from parent routers.
   * @param {string} key
   * @param {*} value
   */
  setGlobal(key, value) {
    this._globals[key] = value;
  }

  /**
   * Set the values of multiple global template variables. Values set on a router override values
   * inherited from parent routers.
   * @param {Object.<string, *>} obj
   */
  setGlobals(obj) {
    _.merge(this._globals, obj);
  }

  /**
   * Configure one or more middleware callbacks to be executed against a specific URI path.
   * @param {*} args
   */
  get(...args) {
    const uri = args[0];
    const callbacks = Array.prototype.slice.call(args, 1);
    this._routes.push([uri, callbacks]);
  }

  use(...args) {
    if (args.length === 1) {
      const callback = args[0];
      this._middleware.push(callback);
    } else if (args.length === 2) {
      const uri = args[0];
      const other = args[1];
      other.initialize(this._site, this, uri);
      this._children.push(other);
    } else {
      throw new Error(`Unsupported number of arguments: ${args.length}`);
    }
  }

  /**
   * Initialize the router into a router hierarchy. This function is internal to MHP and should not
   * be called directly.
   * @param {*} site
   * @param {*} parent
   * @param {*} pathPrefix
   */
  initialize(site, parent, pathPrefix = '') {
    if (this._parent !== undefined) {
      throw new Error(`Router has already been initialized at ${this._pathPrefix}`);
    }
    this._site = site;
    this._parent = parent;
    this._pathPrefix = pathPrefix;
  }

  /**
   * Execute the route handlers for this router and all of its children. This is always called
   * automatically after the route callback, so there should be no need to call this manually.
   */
  execute() {
    this._executePriority();
    this._executeRegular();
  }

  /**
   * Execute high priority route handlers, first for child routers and then this one. A high
   * priority route handler is any with at least one middleware with the _mhp_priority field set.
   * Currently, the only built-in one is posts(), which uses the priority flag so that canonical
   * post paths are always generated before any index pages that reference them.
   */
  _executePriority() {
    this._children.forEach(child => child._executePriority());
    this._routes
      .filter(route => route[1].filter(callback => callback._mhp_priority).length > 0)
      .forEach(route => this._executeRoute(route));
  }

  /**
   * Execute regular priority route handlers, first for child routers and then this one.
   */
  _executeRegular() {
    this._children.forEach(child => child._executeRegular());
    this._routes
      .filter(route => route[1].filter(callback => callback._mhp_priority).length === 0)
      .forEach(route => this._executeRoute(route));
  }

  _executeRoute(route) {
    const uri = route[0];
    const callbacks = route[1];

    let cleanedURI = `${this._pathPrefix}${uri}`;
    if (cleanedURI.startsWith('/')) {
      cleanedURI = cleanedURI.slice(1);
    }
    const parts = cleanedURI.split('/');

    const middleware = [];
    middleware.push(...this.middleware);
    middleware.push(...callbacks);

    this._generate(parts, middleware);
  }

  _generate(parts, callbacks, postSet, params = {}) {
    let posts;
    if (postSet) {
      posts = postSet;
    } else {
      posts = this._site.postDb.slice();
    }

    const request = new Request(this, parts, params);
    const response = new Response(this, request, posts);

    // Run callbacks when there are no more parameter expansions to be done in the path
    const groupCount = parts.filter(item => item.startsWith(':')).length;
    if (groupCount === 0) {
      callbacks.forEach((callback) => {
        callback(request, response);
      });
      return;
    }

    callbacks
      .filter(callback => callback._mhp_filter || callback._mhp_sorter)
      .forEach(callback => callback(request, response));

    const path = [];
    parts.forEach((item, i) => {
      if (item.startsWith(':')) {
        const fieldName = item.slice(1);
        response.posts
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
