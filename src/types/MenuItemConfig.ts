export type MenuItemConfig = {
  readonly uri?: string;
  readonly slug?: string;
  readonly title?: string;
  readonly children?: readonly MenuItemConfig[];
  readonly attributes?: Record<string, unknown>;
};
