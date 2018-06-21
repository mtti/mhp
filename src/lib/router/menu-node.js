const _ = require('lodash');

class MenuNode {
  constructor(parent, name) {
    this._name = name;
    this._parent = parent;
    this._children = {};
    this._properties = {};
  }

  /**
   * Set menu node properties.
   */
  set(...args) {
    if (args.length === 1) {
      _.merge(this._properties, args[0]);
    } else if (args.length === 2) {
      this._properties[args[0]] = this._properties[args[1]];
    }
    return this;
  }

  /**
   * Create or get a child node.
   * @param {*} name
   */
  child(name) {
    if (name in this._children) {
      return this._children[name];
    }
    const child = new MenuNode(this, name);
    this._children[name] = child;
    return child;
  }

  /**
   * Get the menu node's parent node.
   */
  up() {
    return this._parent;
  }

  /**
   * Execute a callback for every node found in a path.
   * @param {string[]} path
   * @param {*} callback
   */
  walkPath(path, callback) {
    const result = [callback(this)];

    if (path.length === 0) {
      return result;
    }

    const childName = path[0];
    if (!(childName in this._children)) {
      return result;
    }

    const childResult = this._children[childName]
      .walkPath(path.slice(1), callback);
    result.push(...childResult);

    return result;
  }

  /**
   * Create a deep copy of a menu node and all of its children.
   */
  clone() {
    const other = new MenuNode(this._parent, this._name);
    other._properties = _.cloneDeep(this._properties);
    other._children = _.fromPairs(_.toPairs(this._children)
      .map(pair => [pair[0], pair[1].clone()]));
    return other;
  }
}

module.exports = MenuNode;
