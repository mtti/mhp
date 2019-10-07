import path from 'path';
import { readFrontMatter } from './readFrontMatter';

function getPath(suffix: string): string {
  return path.join(
    __dirname,
    '..',
    '..',
    'test',
    `readFrontMatter.${suffix}`,
  );
}

describe(readFrontMatter.name, () => {
  describe('when set to not read body', () => {
    it('returns attributes and no body', async (): Promise<void> => {
      const result = await readFrontMatter(
        getPath('happyCase.html'),
        '<!--',
        '-->',
        false,
      );
      expect(result.attributes).toEqual({
        foo: 'bar',
        hello: 'world',
      });
      expect(result.body.length).toBe(0);
    });

    it('loads no attributes or body when the file has no attributes', async (): Promise<void> => {
      const result = await readFrontMatter(
        getPath('noAttributes.html'),
        '<!--',
        '-->',
        false,
      );
      expect(result.attributes).toEqual({});
      expect(result.body.length).toBe(0);
    });
  });

  describe('when set to read body', () => {
    it('returns attributes and body', async (): Promise<void> => {
      const result = await readFrontMatter(
        getPath('happyCase.html'),
        '<!--',
        '-->',
        true,
      );
      expect(result.attributes).toEqual({
        foo: 'bar',
        hello: 'world',
      });
      expect(result.body).toMatch(/Lorem ipsum/);
    });

    it('loads no attributes when the file has no attributes', async (): Promise<void> => {
      const result = await readFrontMatter(
        getPath('noAttributes.html'),
        '<!--',
        '-->',
        true,
      );
      expect(result.attributes).toEqual({});
      expect(result.body).toMatch(/Lorem ipsum/);
    });

    it('returns attributes an no body with unclosed attributes', async (): Promise<void> => {
      const result = await readFrontMatter(
        getPath('unclosedAttributes.html'),
        '<!--',
        '-->',
        true,
      );
      expect(result.attributes).toEqual({
        foo: 'bar',
        hello: 'world',
      });
      expect(result.body.length).toBe(0);
    });
  });
});
