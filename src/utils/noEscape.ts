import nunjucks from 'nunjucks';

export type SafeString = nunjucks.runtime.SafeString;

export const noEscape = (str: string): SafeString => new nunjucks
  .runtime.SafeString(str);
