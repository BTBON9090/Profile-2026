// Usage: node scripts/import-driving.mjs /absolute/path/to/parking-master-pro-v2.0
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const source = process.argv[2];
if (!source || !path.isAbsolute(source)) throw Error('Provide the absolute source project path.');
const target = path.resolve('public/parking-master/play');
execFileSync('npm', ['run', 'build', '--', '--outDir', target], { cwd: source, env: { ...process.env, BASE_PATH: '/parking-master/play/' }, stdio: 'inherit' });
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
writeFileSync(path.join(target, 'source.json'), JSON.stringify({ repository: 'https://github.com/BTBON9090/parking-master-pro-v2.0', commit, basePath: '/parking-master/play/' }, null, 2) + '\n');
