import { BuildContext } from './BuildContext';
import { Page } from './Page';

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
  template: string,
) => string;

export type WriteFunc = (
  uri: readonly string[],
  content: string,
) => Promise<void>;

export type Environment = {
  readonly renderString: RenderStringFunc;
  readonly render: RenderFunc;
  readonly write: WriteFunc;
  readonly loadPage: LoadPageFunc;
};
