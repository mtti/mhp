import { TemplateSource } from './TemplateSource';

export type RenderHookOptions = {
  template: TemplateSource,
  vars: Record<string, unknown>,
};
