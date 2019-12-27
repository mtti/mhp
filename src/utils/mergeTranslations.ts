/**
 * Merge translation dictionaries.
 *
 * @param strings
 */
export function mergeTranslations(
  dictionaries: readonly Record<string, Record<string, string>>[],
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  dictionaries.forEach((cur) => {
    Object.entries(cur).forEach(([lang, strings]) => {
      if (!result[lang]) {
        result[lang] = {};
      }
      Object.entries(strings).forEach(([key, value]) => {
        result[lang][key] = value;
      });
    });
  });

  return result;
}
