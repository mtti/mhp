import { isUuidString } from './isUuidString';

export function expectUuidString(value: unknown): string {
  if (isUuidString(value)) {
    return value;
  }
  throw new Error('Expected UUID string');
}
