const path = require('path');
const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');
const mime = require('mime-types');
const Q = require('q');
const logger = require('./logger');

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

/**
 * Delete any files in outputDirectory that are not listed in knownFiles.
 * @param {string} outputDirectory Absolute path of the directory to clean.
 * @param {string[]} knownFiles Absolute paths of all files that should not be deleted.
 */
function cleanUnknownFiles(outputDirectory, knownFiles) {
  const known = _.fromPairs(knownFiles.map(filename => [filename, true]));

  function clean(directory) {
    const items = fs.readdirSync(directory)
      .map(filename => path.join(directory, filename))
      .filter(filePath => !(filePath in known))
      .map(filePath => ({ filePath, stats: fs.statSync(filePath) }));

    items
      .filter(item => item.stats.isFile())
      .forEach((item) => {
        logger.verbose(`Deleting ${item.filePath}`);
        fs.removeSync(item.filePath);
      });

    items
      .filter(item => item.stats.isDirectory())
      .forEach((item) => {
        clean(item.filePath);
      });

    if (fs.readdirSync(directory).length === 0) {
      logger.verbose(`Removing empty directory ${directory}`);
      fs.rmdirSync(directory);
    }
  }

  clean(outputDirectory);
}

function isInActivePath(uri, activePath, exact = false) {
  if (exact) {
    return uri === activePath;
  }
  return activePath.length > 0 && activePath.startsWith(uri);
}

function mustStartWith(str, prefix) {
  if (str.startsWith(prefix)) {
    return str;
  }
  return `${prefix}${str}`;
}

function mustEndWith(str, suffix) {
  if (str.endsWith(suffix)) {
    return str;
  }
  return `${str}${suffix}`;
}

function mustNotStartWith(str, prefix) {
  if (!str.startsWith(prefix)) {
    return str;
  }
  return str.slice(prefix.length);
}

function mustNotEndWith(str, suffix) {
  if (!str.endsWith(suffix)) {
    return str;
  }
  return str.slice(0, str.length - suffix.length);
}

/**
 * Removes a substring from both sides of a string.
 * @param {string} str Main string.
 * @param {string} affix Substring to remove.
 */
function trim(str, affix) {
  return mustNotEndWith(mustNotStartWith(str, affix), affix);
}

function cleanUri(uri) {
  const trimmedUri = trim(uri, '/');
  const parts = trimmedUri.split('/');
  const filename = parts.slice(-1)[0];
  const ext = filename.split('.').slice(-1)[0];

  if (ext === 'html') {
    if (filename === 'index.html') {
      parts.splice(parts.length - 1, 1);
    } else {
      parts[parts.length - 1] = filename.split('.').slice(0, -1).join('.');
    }
  }

  return parts.join('/');
}

module.exports = {
  cleanAttributes,
  replaceExtension,
  guessMimeType,
  cleanUnknownFiles,
  isInActivePath,
  mustStartWith,
  mustEndWith,
  mustNotStartWith,
  mustNotEndWith,
  trim,
  cleanUri,
  asyncMap: Q.nfbind(async.map),
};
