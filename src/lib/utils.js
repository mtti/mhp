
const _ = require('lodash');

function cleanAttributes(attributes) {
  return _.fromPairs(_.toPairs(attributes).map((pair) => {
    if (pair[0].startsWith('_')) {
      return [pair[0].substring(1), pair[1]];
    }
    return pair;
  }));
}

module.exports = {
  cleanAttributes,
};
