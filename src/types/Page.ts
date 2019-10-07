export type Page = {
  vars: Record<string, unknown>;
  body: string;
  extension: string;
  template?: string;
};
