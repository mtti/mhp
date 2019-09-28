export function getUriParameters(uriParts: string[]): string[] {
  return uriParts
    .filter((item) => item.startsWith(':'))
    .map((str) => str.slice(1));
}
