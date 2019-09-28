/**
 * Returns `subject` with `suffix` removed from its end.
 *
 * @param subject
 * @param suffix
 */
export function mustNotEndWith(subject: string, suffix: string): string {
  if (!subject.endsWith(suffix)) {
    return subject;
  }
  return subject.slice(0, subject.length - suffix.length);
}
