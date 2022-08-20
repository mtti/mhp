/* eslint-disable arrow-body-style */

import hljs from 'highlight.js';
import { marked } from 'marked';

export type RenderMarkdownFunc = (input: string) => string;

export const renderMarkdown = (

): RenderMarkdownFunc => (
  input,
) => {
  return marked(
    input,
    {
      highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
    },
  );
};
