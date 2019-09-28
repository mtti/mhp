import { DateTime } from 'luxon';
import { expectDateTime } from './expectDateTime';

describe(expectDateTime.name, () => {
  it('return a valid DateTime when given an ISO8601 string', () => {
    const result = expectDateTime('2018-11-09T00:12+00:00');
    expect(result).toBeInstanceOf(DateTime);
    expect(result.isValid).toBeTruthy();
  });

  it('throws when given an invalid string', () => {
    expect(() => expectDateTime('not ISO 8601')).toThrow();
  });
});
