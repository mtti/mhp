const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  './src/middleware',
  './src/plugins',
  './src/sort',
  './src/types',
];

const generateBarrels = (directory) => {
  const exports = fs
    .readdirSync(directory)
    .filter((filename) => filename !== 'index.ts')
    .filter((filename) => !filename.endsWith('.spec.ts'))
    .filter((filename) => !filename.endsWith('.test.ts'))
    .filter((filename) => filename.endsWith('.ts'))
    .map((filename) => filename.slice(0, -3))
    .map((filename) => `export * from './${filename}';`);

  const lines = [
    '// This file is automatically generated',
    '',
    ...exports,
    '',
  ];

  const indexTs = path.join(directory, 'index.ts');
  console.log(`Writing: ${indexTs}`);

  fs.writeFileSync(
    indexTs,
    lines.join('\n'),
    { encoding: 'utf-8' },
  );
};

for (const directory of DIRECTORIES) {
  generateBarrels(directory);
}
