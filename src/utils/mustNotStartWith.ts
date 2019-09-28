/**
 * Returns a version of `subject` with `prefix` removed from its beginning if
 * it starts with that.
 *
 * @param subject
 * @param prefix
 */

export function mustNotStartWith(subject: string, prefix: string): string {
  if (!subject.startsWith(prefix)) {
    return subject;
  }
  return subject.slice(prefix.length);
}
