export type Breadcrumb = {
  readonly slug: string;
  readonly title?: string;
  readonly children?: readonly Breadcrumb[];
};
