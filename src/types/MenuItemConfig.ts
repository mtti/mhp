export type MenuItemConfig = {
  readonly uri?: string;

  readonly slug?: string;

  readonly title?: string;

  /**
   * Title of this menu item when shown in a breadcrumb trail. Defaults to
   * `title`.
   */
  readonly breadcrumbTitle?: string;

  /**
   * Is the item visible in menus? Defaults to `true` if not specified.
   */
  readonly visible?: boolean;

  readonly children?: readonly MenuItemConfig[];

  readonly attributes?: Record<string, unknown>;
};
