import { Post } from '../Post';
import { attributeEqualsOrIncludes } from './attributeEqualsOrIncludes';

function makePost(value: string|string[]): Post {
  return {
    attributes: { target: value },
  } as unknown as Post;
}

describe(attributeEqualsOrIncludes.name, () => {
  it('returns true when string value equals', () => {
    const result = attributeEqualsOrIncludes(
      makePost('value'),
      'target',
      'value',
    );
    expect(result).toBe(true);
  });

  it('returns false when string value does not equal', () => {
    const result = attributeEqualsOrIncludes(
      makePost('wrong value'),
      'target',
      'value',
    );
    expect(result).toBe(false);
  });

  it('returns true when array value contains', () => {
    const result = attributeEqualsOrIncludes(
      makePost(['value']),
      'target',
      'value',
    );
    expect(result).toBe(true);
  });

  it('returns false when array value does not contain', () => {
    const result = attributeEqualsOrIncludes(
      makePost(['wrong value']),
      'target',
      'value',
    );
    expect(result).toBe(false);
  });
});
