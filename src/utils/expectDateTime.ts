import { DateTime } from 'luxon';
import { expectString } from './expectString';

/**
 * Return a luxon DateTime object when given a valid string representation of
 * an ISO 8601 datetime or throw an error if the string is invalid.
 *
 * @param value Any value
 * @returns A luxon DateTime
 */
export function expectDateTime(value: unknown): DateTime {
  const result = DateTime.fromISO(expectString(value));
  if (!result.isValid && result.invalidExplanation) {
    throw new Error(result.invalidExplanation);
  }
  return result;
}
