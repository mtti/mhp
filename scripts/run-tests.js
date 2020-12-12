const { spawn } = require('child_process');
const path = require('path');

const hrstart = process.hrtime();

const UNIT_BATCH = [
  { name: 'unit tests', cmd: 'npm', args: ['run', 'test'], cwd: path.resolve(__dirname, '..') },
];

const SNAPSHOT_BATCH = [
  { name: 'prepare snapshot test', cmd: 'npm', args: ['install'], cwd: path.resolve(__dirname, '..', 'test-site')},
  { name: 'run snapshot test', cmd: 'npm', args: ['run', 'test'], cwd: path.resolve(__dirname, '..', 'test-site')},
]

const run = ({name, cmd, args, cwd}) => {
  return new Promise((resolve) => {
    proc = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      const hrend = process.hrtime(hrstart);
      console.log(`${name} %ds %dms`, hrend[0], hrend[1] / 1000000)
      resolve(code);
    });
  });
}

const runParallel = async (batch) => {
  const result = await Promise.all(batch.map(run));

  if (result.some(code => code !== 0)) {
    return 1;
  }

  return 0;
}

const runSeries = async (commands) => {
  for (const cmd of commands) {
    const code = await run(cmd);
    if (code !== 0) return 1;
  }
  return 0;
};

(async () => {
  const promises = [
    runParallel(UNIT_BATCH),
    runSeries(SNAPSHOT_BATCH),
  ];

  const result = await Promise.all(promises);
  const hrend = process.hrtime(hrstart);
  console.log(`total %ds %dms`, hrend[0], hrend[1] / 1000000)

  if (result.some(code => code !== 0)) process.exit(1);
  process.exit(0);
})();
