
const _ = require('lodash');

function cleanAttributes(attributes) {
  return _.reduce(attributes, (result, value, key) => {
    if (key.startsWith('_')) {
      result[key.substring(1)] = value;
    } else {
      result[key] = value;
    }
    return result;
  }, {});
}

module.exports = {
  cleanAttributes,
};
