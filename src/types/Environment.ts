import { BuildContext } from './BuildContext';

export type RenderStringFunc = (
  str: string,
  vars: Record<string, unknown>,
) => string;

export type RenderFunc = (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: string,
) => string;

export type WriteFunc = (
  uri: string[],
  content: string,
) => Promise<void>;

export type Environment = {
  readonly renderString: RenderStringFunc;
  readonly render: RenderFunc;
  readonly write: WriteFunc;
};
