const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const hashExtensions = ['.html', '.xml'];
const DIST = path.join(__dirname, '..', 'dist');
const CHECKSUM_FILE = path.join(__dirname, 'checksums.json');

function hashFile(filePath) {
  return new Promise((resolve) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => {
      hash.update(data);
    });
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
  });
}

async function scanDirectory(directory, root = null) {
  if (!root) {
    root = directory;
  }

  const children = fs.readdirSync(directory)
    .map(name => ({ name, path: path.join(directory, name)}))
    .map(child => ({ ...child, relPath: path.relative(root, child.path)}))
    .map(child => ({ ...child, stat: fs.statSync(child.path)}));

  const files = children
    .filter(child => child.stat.isFile())
    .filter(child => hashExtensions.includes(path.extname(child.name)));
  const subdirectories = children.filter(child => child.stat.isDirectory());

  for (let file of files) {
    file.checksum = await hashFile(file.path);
  }

  const result = files.map(file => [file.relPath, file.checksum]);

  for (let subdirectory of subdirectories) {
    const subdirResult = await scanDirectory(subdirectory.path, root);
    result.push(...subdirResult);
  }

  return result;
}

function fromPairs(items) {
  const result = {};
  for (let item of items) {
    result[item[0]] = item[1];
  }
  return result;
}

async function save() {
  const checksums = await scanDirectory(DIST);
  fs.writeFileSync(CHECKSUM_FILE, JSON.stringify(checksums, null, 4));
  process.exit(0);
}

async function compare() {
  const actual = await scanDirectory(DIST);
  let expected = JSON.parse(fs.readFileSync(CHECKSUM_FILE, 'utf8'));

  if (actual.length != expected.length) {
    console.log(`FAIL: Different number of files: expected ${expected.length}, got ${actual.length}`);
    process.exit(1);
  }

  expected = fromPairs(expected);

  let fail = false;
  for (let item of actual) {
    const [relPath, checksum] = item;
    if (expected[relPath] !== checksum) {
      console.log(`FAIL: ${relPath}: ${expected[relPath]} vs. ${checksum}`);
      fail = true;
    }
  }

  if (fail) {
    process.exit(1);
  } else {
    console.log('OK: No differences found');
    process.exit(0);
  }
}

(async () => {
  const command = process.argv[2];

  if (command === 'save') {
    save();
  } else if (command === 'compare') {
    compare();
  } else {
    console.log('Invalid command');
    process.exit(1);
  }
})();
