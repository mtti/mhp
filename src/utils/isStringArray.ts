export function isStringArray(subject: unknown): subject is string[] {
  if (!Array.isArray(subject)) {
    return false;
  }

  if (subject.some((value) => typeof value !== 'string')) {
    return false;
  }

  return true;
}
