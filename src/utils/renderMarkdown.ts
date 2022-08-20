/* eslint-disable arrow-body-style */

import { marked } from 'marked';

export type RenderMarkdownFunc = (input: string) => string;

export const renderMarkdown = (

): RenderMarkdownFunc => (
  input,
) => {
  return marked(input);
};
