const _ = require('lodash');

function cleanAttributes(attributes) {
  return _.fromPairs(_.toPairs(attributes).map((pair) => {
    if (pair[0].startsWith('_')) {
      return [pair[0].substring(1), pair[1]];
    }
    return pair;
  }));
}

/**
 * Replace file extension with another one.
 * @param {*} originalPath
 * @param {*} newExtension
 */
function replaceExtension(originalPath, newExtension) {
  const parts = originalPath.split('.').slice(0, -1);
  parts.push(newExtension);
  return parts.join('.');
}

module.exports = {
  cleanAttributes,
  replaceExtension,
};
