import { BuildContext } from './BuildContext';
import { Page } from './Page';
import { TemplateSource } from './TemplateSource';

export type RenderStringFunc = (
  str: string,
  vars: Record<string, unknown>,
) => string;

export type LoadPageFunc = (
  name: string,
) => Promise<Page>;

export type RenderFunc = (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: TemplateSource,
) => string;

export type WriteOptions = {
  contentType?: string;
};

export type WriteFunc = (
  uri: readonly string[],
  content: string,
  options?: WriteOptions,
) => Promise<void>;

export type Environment = {
  readonly renderString: RenderStringFunc;
  readonly render: RenderFunc;
  readonly write: WriteFunc;
  readonly loadPage: LoadPageFunc;
  readonly globals: Record<string, unknown>;
};
