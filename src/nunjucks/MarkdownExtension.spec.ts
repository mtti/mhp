import nunjucks from 'nunjucks';
import { renderMarkdown } from '../utils/renderMarkdown';
import { MarkdownExtension } from './MarkdownExtension';

const source: string = `<div>
  {% markdown %}
  # Markdown {{ foo }}
  {% endmarkdown %}
</div>
`;

const expected: string = `<div>
  <h1 id="markdown-bar">Markdown bar</h1>

</div>
`;

describe(MarkdownExtension.name, () => {
  let env: nunjucks.Environment;

  beforeEach(() => {
    env = new nunjucks.Environment();
    env.addExtension(
      'MarkdownExtension',
      new MarkdownExtension(renderMarkdown()),
    );
  });

  it('parses markdown correctly', () => {
    const result = env.renderString(source, { foo: 'bar' });
    expect(result).toBe(expected);
  });
});
