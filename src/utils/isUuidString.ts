const uuidPatterns: { [index: string]: RegExp } = {
  v4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  v5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  any: /^[0-9A-F]{8}-[0-9A-F]{4}-(4|5)[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
};

export function isUuidString(value: unknown): value is string {
  return (
    typeof value === 'string'
    && value.length >= 32 && value.length <= 36
    && uuidPatterns.any.test(value)
  );
}
