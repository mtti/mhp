import { TemplateSource } from './TemplateSource';

export type RenderOptions = {
  template: TemplateSource;
  vars: Record<string, unknown>;
};
