/**
 * Replace the plain name of an asset with its hashed version if an asset
 * manifest is loaded.
 *
 * @param this
 * @param input
 */
export function assetUrl(this: any, input: string): string {
  let filename = input;
  if (this.ctx.assetManifest && input in this.ctx.assetManifest) {
    filename = this.ctx.assetManifest[input];
  }
  return `${this.ctx.baseUrl}/assets/${filename}`;
}
