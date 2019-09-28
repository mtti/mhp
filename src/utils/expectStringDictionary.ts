export function expectStringDictionary(
  subject: unknown,
): Record<string, string> {
  if (!subject) {
    throw new Error('Expected a truthy value');
  }
  if (typeof subject !== 'object') {
    throw new Error(`Expected object, got ${typeof subject}`);
  }

  const hasNonString = Object.entries(subject as any).some(([key, value]) => (
    typeof key !== 'string' || typeof value !== 'string'
  ));
  if (hasNonString) {
    throw new Error('Expected Record<string, string>');
  }

  return subject as Record<string, string>;
}
