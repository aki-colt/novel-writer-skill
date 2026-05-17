#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SKILL_NAME = 'novel-writer';
const FILES = ['SKILL.md', 'README.md'];

function getHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

function resolveTarget(args) {
  if (args.includes('--target')) {
    const idx = args.indexOf('--target');
    const target = args[idx + 1];
    if (!target) { console.error('Error: --target requires a path'); process.exit(1); }
    return path.resolve(target);
  }
  if (args.includes('--project')) {
    return path.resolve(process.cwd(), '.claude', 'skills', SKILL_NAME);
  }
  const home = getHome();
  if (!home) { console.error('Error: cannot determine home directory'); process.exit(1); }
  return path.join(home, '.claude', 'skills', SKILL_NAME);
}

function install(target) {
  fs.mkdirSync(target, { recursive: true });
  const srcDir = path.resolve(__dirname);
  for (const file of FILES) {
    fs.copyFileSync(path.join(srcDir, file), path.join(target, file));
  }
  console.log(`Installed to: ${target}`);
  console.log(`  - SKILL.md`);
  console.log(`  - README.md`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: npx novel-writer-skill [options]

Options:
  --project      Install to current project's .claude/skills/
  --target <dir> Install to a custom directory
  -h, --help     Show this help

Default installs to: ~/.claude/skills/novel-writer/`);
    return;
  }
  const target = resolveTarget(args);
  install(target);
}

main();
