export type MenuItem = {
  readonly uri: readonly string[];
  readonly slug?: string;
  readonly title: string;
  readonly breadcrumbTitle: string;
  readonly visible: boolean;
  readonly children: readonly MenuItem[];
  readonly attributes: Record<string, unknown>;
};
