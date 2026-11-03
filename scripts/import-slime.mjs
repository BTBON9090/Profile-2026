// Usage: node scripts/import-slime.mjs /absolute/path/to/slime-project
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import path from 'node:path';
const source = process.argv[2];
if (!source || !path.isAbsolute(source)) throw new Error('Provide the absolute path to the source game.');
const { build } = createRequire(path.join(source, 'package.json'))('esbuild');
const out = path.resolve('public/merge-slime');
await mkdir(out, { recursive: true });
await cp(path.join(source, 'assets/game'), path.join(out, 'assets/game'), { recursive: true });
await mkdir(path.join(out, 'assets/brand'), { recursive: true });
await cp(path.join(source, 'assets/brand/合成史莱姆-微信头像-144.png'), path.join(out, 'assets/brand/icon.png'));
let html = await readFile(path.join(source, 'index.html'), 'utf8');
html = html.replace('/web/style.css', './style.css').replace('/src/platform/web.js', './game.js').replace('href="/"', 'href="/appbox"').replace('aria-label="合成巨型史莱姆首页"', 'aria-label="返回 AppBox"');
html = html.replace('id="stage-test-entry"', 'id="stage-test-entry" hidden');
await writeFile(path.join(out, 'index.html'), html);
const css = (await readFile(path.join(source, 'web/style.css'), 'utf8')).replaceAll('/assets/', './assets/').replace('brand/合成史莱姆-微信头像-144.png', 'brand/icon.png');
await writeFile(path.join(out, 'style.css'), css + '\n[hidden]{display:none!important}\n');
await build({ entryPoints: [path.join(source, 'src/platform/web.js')], bundle: true, outfile: path.join(out, 'game.js'), format: 'iife', target: 'es2018', minify: true, legalComments: 'none', plugins: [{name:'appbox-web', setup(b) {
  b.onLoad({filter:/src\/platform\/web\.js$/}, async a => ({contents:(await readFile(a.path,'utf8')).replace("'/assets/game'", "'/merge-slime/assets/game'").replace("if (new URLSearchParams(location.search).has('test'))", 'if (false)'), loader:'js'}));
  b.onLoad({filter:/test-mode\.js$/}, async a => ({contents:(await readFile(a.path,'utf8')).replace('STAGE_TESTING_ENABLED = true', 'STAGE_TESTING_ENABLED = false'), loader:'js'}));
}}] });
console.log('Imported online-only Slime game; public build disables temporary stage testing.');
