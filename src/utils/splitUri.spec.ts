import { splitUri } from './splitUri';

describe(splitUri.name, () => {
  it('when given just a slash returns a zero-length array', () => {
    const result = splitUri('/');
    expect(result.length).toBe(0);
  });

  it('when given an empty string returns a zero-length array', () => {
    const result = splitUri('');
    expect(result.length).toBe(0);
  });
});
