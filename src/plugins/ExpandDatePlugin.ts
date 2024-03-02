import { Post } from '../Post';
import { Plugin } from '../types/BuildOptions';
import { expectDateTime } from '../utils/expectDateTime';

/**
 * A plugin which extracts different date components of an attribute into
 * their own separate attributes for use as path variables.
 */
export class ExpandDatePlugin implements Plugin {
  private _attribute: string;

  /**
   * Create a new ExpandDatePlugin instance.
   *
   * @param attribute Name of the DateTime attribute to extract. If the
   *  attribute is not set, it's ignored.
   */
  constructor(attribute: string) {
    this._attribute = attribute;
  }

  onPreprocessPost = async (post: Post) => {
    const { attributes } = post;

    if (!attributes[this._attribute]) {
      return post;
    }

    const value = expectDateTime(attributes[this._attribute]);

    post.set({
      [`${this._attribute}Day`]: value.day.toString(),
      [`${this._attribute}Month`]: value.month.toString(),
      [`${this._attribute}Year`]: value.year.toString(),
    });

    return post;
  };
}
