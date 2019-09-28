import { cleanUri } from './cleanUri';

describe(cleanUri.name, () => {
  it('returns an empty array when given an empty array', () => {
    const result = cleanUri([]);
    expect(result.length).toBe(0);
  });
});
