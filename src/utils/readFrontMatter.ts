import stream from 'stream';
import fs from 'fs-extra';
import YAML from 'yaml';
import { LineStream } from '@mtti/lines';

export type FrontMatterDocument = {
  attributes: Record<string, unknown>;
  body: string;
};

/**
 * Read a front-mattered document from a file or stream.
 *
 * @param source
 * @param startMarker
 * @param endMarker
 * @param readBody
 */
export function readFrontMatter(
  source: string|stream.Readable,
  startMarker: string,
  endMarker: string,
  readBody: boolean = true,
): Promise<FrontMatterDocument> {
  return new Promise((resolve, reject): void => {
    let inputStream: stream.Readable;
    if (typeof source === 'string') {
      inputStream = fs.createReadStream(source, { encoding: 'utf8' });
    } else {
      inputStream = source;
    }

    const lineStream = new LineStream();

    let state: string = 'started';
    const frontMatterLines: string[] = [];
    const bodyLines: string[] = [];

    lineStream.on('error', (err) => {
      state = 'ended';
      reject(err);
    });

    lineStream.on('data', (line: string) => {
      if (state === 'started') {
        if (line === startMarker) {
          state = 'collectingFrontMatter';
        } else if (readBody) {
          state = 'collectingBody';
        } else {
          state = 'ended';
          inputStream.destroy();
        }
      } else if (state === 'collectingFrontMatter') {
        if (line === endMarker) {
          if (readBody) {
            state = 'collectingBody';
          } else {
            state = 'ended';
            inputStream.destroy();
          }
          return;
        }
        frontMatterLines.push(line);
      } else if (state === 'collectingBody') {
        bodyLines.push(line);
      }
    });

    inputStream.on('close', () => {
      state = 'ended';

      const attributes = YAML.parse(frontMatterLines.join('\n'));

      resolve({
        attributes: attributes || {},
        body: bodyLines.join('\n'),
      });
    });

    inputStream.pipe(lineStream);
  });
}
