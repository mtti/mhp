export function expectNumber(value: unknown): number {
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new Error('Expected a number');
  }

  return num;
}
