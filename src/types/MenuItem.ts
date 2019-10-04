export type MenuItem = {
  readonly slug: string;
  readonly title?: string;
  readonly children?: readonly MenuItem[];
};
