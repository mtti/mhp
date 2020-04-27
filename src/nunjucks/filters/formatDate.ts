import { DateTime } from 'luxon';
import { NunjucksContext } from '../NunjucksContext';
import { expectString } from '../../utils/expectString';

export function formatDate(
  this: NunjucksContext,
  input: unknown,
  format?: unknown,
): string {
  if (!(input instanceof DateTime)) {
    throw new Error('Expected DateTime instance');
  }

  const zone = this.ctx.timeZone ? expectString(this.ctx.timeZone) : 'UTC';
  const rezoned = input.setZone(zone);

  const formatString = format ? expectString(format) : null;
  const dateFormat = this.ctx.dateFormat
    ? expectString(this.ctx.dateFormat) : null;

  const useFormat = formatString || dateFormat || 'yyyy-MM-dd';
  return rezoned.toFormat(useFormat);
}
