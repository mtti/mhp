/* eslint-disable arrow-body-style */

import hljs from 'highlight.js';
import { Marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';

export type RenderMarkdownFunc = (input: string) => string;

export const renderMarkdown = (): RenderMarkdownFunc => (
  input,
): string => {
  const marked = new Marked(
    { async: false },
    markedHighlight({
      async: false,
      highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
    }),
    gfmHeadingId(),
  );

  return marked.parse(input, { async: false }) as string;
};
