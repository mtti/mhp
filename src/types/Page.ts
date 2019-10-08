import { TemplateSource } from './TemplateSource';

export type Page = {
  vars: Record<string, unknown>;
  body?: string;
  extension: string;
  template: TemplateSource;
};
