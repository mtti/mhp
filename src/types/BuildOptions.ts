import { MenuItem } from './MenuItem';

export type BuildOptions = {
  templateDirectories?: readonly string[];
  menu?: readonly MenuItem[];
  globals?: Record<string, unknown>;
};
