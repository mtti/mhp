import { Breadcrumb } from './Breadcrumb';

export type BuildOptions = {
  templateDirectories?: readonly string[];
  breadcrumbs?: readonly Breadcrumb[];
  globals?: Record<string, unknown>;
};
