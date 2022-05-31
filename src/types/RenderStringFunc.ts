export type RenderStringFunc = (
  str: string,
  vars: Record<string, unknown>,
) => string;
