import { cleanUri } from './cleanUri';

describe(cleanUri.name, () => {
  it('returns an empty array when given an empty array', () => {
    const result = cleanUri([]);
    expect(result.length).toBe(0);
  });

  it('removes extension from regular paths', () => {
    const result = cleanUri(['foo', 'bar', 'baz.html']);
    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('removes index.html entirely', () => {
    const result = cleanUri(['foo', 'bar', 'index.html']);
    expect(result).toEqual(['foo', 'bar']);
  });

  it('does not change non-html extension', () => {
    const result = cleanUri(['foo', 'bar', 'baz.txt']);
    expect(result).toEqual(['foo', 'bar', 'baz.txt']);
  });
});
