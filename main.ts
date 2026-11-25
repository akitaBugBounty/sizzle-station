// Sizzle Station hand-in program: copies game/ and screenshots/ into the
// output directory and writes dossier.json with the kit's buildDossier.
// Node standard library only, erasable TypeScript, no network, no clock
// and no randomness in what it writes, so two runs are byte-identical.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const OUTPUT_ENV = 'MAKEFUN_OUTPUT_DIR';

function repoRoot(): string {
  const cwd = process.cwd();
  if (existsSync(join(cwd, 'game', 'index.html')) && existsSync(join(cwd, 'vendor', 'makefun-game.ts'))) {
    return cwd;
  }
  return dirname(fileURLToPath(import.meta.url));
}

function copyTreeSorted(sourceDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  const entries = readdirSync(sourceDir).sort();
  for (const name of entries) {
    const source = join(sourceDir, name);
    const target = join(targetDir, name);
    const st = statSync(source);
    if (st.isDirectory()) {
      copyTreeSorted(source, target);
    } else if (st.isFile()) {
      cpSync(source, target);
    }
  }
}

function main(): void {
  const root = repoRoot();
  const outDir = process.env[OUTPUT_ENV] || '/output';
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const screenshotsDir = join(root, 'screenshots');
  const shotNames = readdirSync(screenshotsDir).filter(function (name) {
    return !name.startsWith('.');
  });
  if (shotNames.length < 3 || shotNames.length > 4) {
    throw new Error('screenshots/: expected 3 or 4 images, found ' + shotNames.length);
  }
  copyTreeSorted(join(root, 'game'), join(outDir, 'game'));
  copyTreeSorted(join(root, 'screenshots'), join(outDir, 'screenshots'));
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

main();
