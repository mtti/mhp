export function getUriParameters(uriParts: readonly string[]): string[] {
  return uriParts
    .filter((item) => item.startsWith(':'))
    .map((str) => str.slice(1));
}
