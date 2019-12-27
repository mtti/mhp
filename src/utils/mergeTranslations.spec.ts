import { mergeTranslations } from './mergeTranslations';

const input: Record<string, Record<string, string>>[] = [
  {
    en: {
      AAA: 'AAA (en)',
    },
    fi: {
      BBB: 'BBB (fi)',
    },
  },
  {
    en: {
      AAA: 'AAA2 (en)',
    },
    fi: {
      CCC: 'CCC (fi)',
    },
  },
];

const expected: Record<string, Record<string, string>> = {
  en: {
    AAA: 'AAA2 (en)',
  },
  fi: {
    BBB: 'BBB (fi)',
    CCC: 'CCC (fi)',
  },
};

describe(mergeTranslations.name, () => {
  it('merges dictionaries correctly', () => {
    const result = mergeTranslations(input);
    expect(result).toEqual(expected);
  });
});
