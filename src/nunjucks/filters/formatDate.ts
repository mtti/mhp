import { DateTime } from 'luxon';

export function formatDate(this: any, input: string, format?: string): string {
  const useFormat = format || (this.ctx.dateFormat as string) || 'yyyy-MM-dd';
  return DateTime.fromISO(input).toFormat(useFormat);
}
