/* eslint-disable class-methods-use-this,
  @typescript-eslint/explicit-module-boundary-types */

import marked from 'marked';
import nunjucks from 'nunjucks';

/**
 * Nunjucks extension for the `{% markdown %}` ... `{% endmarkdown %}` tags.
 */
export class MarkdownExtension implements nunjucks.Extension {
  tags: string[] = ['markdown'];

  parse(parser: any, nodes: any, lexer: any): any {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    const body = parser.parseUntilBlocks('endmarkdown');

    // "I found Nunjucks  to be incredibly convoluted on how to just get some
    // data into the BlockTag function, this finally worked by faking another
    // template node." (from nunjucks-markdown)
    const tabStart = new nodes.NodeList(
      0, 0, [new nodes.Output(
        0, 0, [new nodes.TemplateData(0, 0, (token.colno - 1))],
      )],
    );

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body, tabStart]);
  }

  run(_context: any, bodyNode: any, tabStartNode: any): any {
    let body = bodyNode();
    const tabStart = tabStartNode();

    // If the {% markdown %} tag is tabbed in, normalize the content to the same
    // depth.
    if (tabStart > 0) {
      body = body
        .split(/\r?\n/)
        .map((line: any) => {
          const startSpaces = line.match(/^[\s]+/);
          // If the content is not at the same or greater tab depth, do nothing.
          if (startSpaces && startSpaces[0].length >= tabStart) {
            // Subtract the column postion from the start of the string.
            return line.slice(tabStart);
          }

          if (startSpaces) {
            return line.slice(startSpaces[0].length);
          }
          return line;
        })
        .join('\n'); // Rejoin into one string.
    }

    return new nunjucks.runtime.SafeString(marked(body));
  }
}
