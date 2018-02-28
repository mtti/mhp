const _ = require('lodash');
const async = require('async');
const mime = require('mime-types');
const Q = require('q');

/**
 * Remove leading underscore from object keys that have one.
 * @param {Object.<string, *>} attributes
 * @returns {Object.<string, *>} An object where leading underscores have been removed from keys.
 */
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
 * @param {string} originalPath
 * @param {string} newExtension
 * @returns {string} The original path with the file extension replaced.
 */
function replaceExtension(originalPath, newExtension) {
  const parts = originalPath.split('.').slice(0, -1);
  parts.push(newExtension);
  return parts.join('.');
}

/**
 * Guess MIME type from file name. Returns `directory` if the file name has no extension and
 * `application/octet-stream` if no MIME type is found based on the extension.
 * @param {string} filename
 * @returns {string} The guessed MIME type.
 */
function guessMimeType(filename) {
  if (filename.split('.').length === 1) {
    return 'directory';
  }
  return mime.lookup(filename) || 'application/octet-stream';
}

module.exports = {
  cleanAttributes,
  replaceExtension,
  guessMimeType,
  asyncMap: Q.nfbind(async.map),
};
