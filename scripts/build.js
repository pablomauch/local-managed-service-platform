const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function collectJs(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJs(full, results);
    } else if (entry.name.endsWith('.js')) {
      results.push(full);
    }
  }
}

const files = [];
collectJs(path.join(__dirname, '..', 'src'), files);
collectJs(path.join(__dirname), files);

let ok = true;
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
    console.log('OK  ' + path.relative(process.cwd(), file));
  } catch {
    console.error('ERR ' + path.relative(process.cwd(), file));
    ok = false;
  }
}

if (!ok) {
  console.error('\nBuild failed: syntax errors found.');
  process.exit(1);
}
console.log('\nBuild OK — ' + files.length + ' file(s) checked.');
