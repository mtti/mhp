export type MenuItemConfig = {
  readonly slug: string;
  readonly title?: string;
  readonly children?: readonly MenuItemConfig[];
};
