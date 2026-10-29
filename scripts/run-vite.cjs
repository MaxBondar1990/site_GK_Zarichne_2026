// npm itself may be running under an older Node in an existing editor terminal.
// Start Vite using the project's .nvmrc version without changing global settings.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const requiredMajor = Number(fs.readFileSync(path.join(root, '.nvmrc'), 'utf8').trim());
let runtime = process.execPath;

if (Number(process.versions.node.split('.')[0]) !== requiredMajor) {
  const versionsDir = path.join(process.env.NVM_DIR || path.join(os.homedir(), '.nvm'), 'versions', 'node');
  const versions = fs.existsSync(versionsDir)
    ? fs.readdirSync(versionsDir).filter(version => version.startsWith(`v${requiredMajor}.`))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    : [];
  runtime = versions.map(version => path.join(versionsDir, version, 'bin', 'node'))
    .find(file => fs.existsSync(file));
  if (!runtime) {
    console.error(`Потрібен Node.js ${requiredMajor}. Виконайте nvm install ${requiredMajor}, потім повторіть команду.`);
    process.exit(1);
  }
}

const env = { ...process.env, PATH: `${path.dirname(runtime)}${path.delimiter}${process.env.PATH || ''}` };
const result = spawnSync(runtime, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), ...process.argv.slice(2)], {
  cwd: root,
  env,
  stdio: 'inherit',
});
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
