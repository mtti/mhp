/* eslint-disable no-underscore-dangle */

const _ = require('lodash');
const sanitizeFilename = require('sanitize-filename');

function generateGroups(directory, options) {
  if (!directory.slice) {
    throw new Error(`Can't generate groups in directory ${directory.uri}\
      which has no posts selected.`);
  }

  if (!options.field) {
    throw new Error(`No grouping field specified for directory ${directory.uri}`);
  }

  const groupOptions = options.options || {};

  directory.slice.groupBy(options.field)
    .forEach((pair) => {
      const directoryOptions = _.cloneDeep(groupOptions);
      directoryOptions._type = 'directory';

      if (!directoryOptions._vars) {
        directoryOptions._vars = {};
      }

      directoryOptions._name = sanitizeFilename(pair[0]);
      directoryOptions._vars.groupingField = options.field;
      [directoryOptions._vars.groupingValue] = pair;

      const subdirectory = directory.addSubdirectory(directoryOptions);
      [, subdirectory.slice] = pair;
    });
}

module.exports = generateGroups;
