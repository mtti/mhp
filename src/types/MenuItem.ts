export type MenuItem = {
  readonly uri: readonly string[];
  readonly slug?: string;
  readonly title: string;
  readonly children: readonly MenuItem[];
};
