const moment = require('moment');
const templateFilters = require('./template-filters');

describe('template filters', () => {
  describe('date', () => {
    let momentObject;
    let context;
    let result;

    beforeEach(() => {
      momentObject = moment('2014-12-23 15:54+02:00');

      context = {
        ctx: {},
      };
    });

    describe('with no format as argument or in context', () => {
      beforeEach(() => {
        result = templateFilters.date.call(context, momentObject);
      });

      it('should format with the default format string', () => {
        expect(result).to.equal('2014-12-23');
      });
    });

    describe('with a format set in context', () => {
      beforeEach(() => {
        context.ctx.dateFormat = 'YYYY';
      });

      describe('when no format argument is given', () => {
        beforeEach(() => {
          result = templateFilters.date.call(context, momentObject);
        });

        it('should use format in context', () => {
          expect(result).to.equal('2014');
        });
      });

      describe('when a format is given as argument', () => {
        beforeEach(() => {
          result = templateFilters.date.call(context, momentObject, 'YYYY-MM');
        });

        it('should format with the argument', () => {
          expect(result).to.equal('2014-12');
        });
      });
    });
  });
});
