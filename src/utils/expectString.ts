export function expectString(subject: unknown): string {
  if (typeof subject !== 'string') {
    throw new Error(`Expected string, got ${typeof subject}`);
  }
  return subject as string;
}
