export function mustStartWith(subject: string, prefix: string): string {
  if (subject.startsWith(prefix)) {
    return subject;
  }
  return `${prefix}${subject}`;
}
