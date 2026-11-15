#!/usr/bin/env node
/**
 * InvestSkill Install Script Test Suite
 *
 * Covers install.sh on two levels:
 *
 *   1. Static checks   — shape of the script itself, and its parity with the
 *                        site's INSTALL_TARGETS list and the documented curl
 *                        commands in the READMEs / Cookbooks.
 *   2. Behaviour tests — install.sh is actually executed in a throwaway
 *                        directory. Network access is replaced by a `curl`
 *                        test double on PATH that serves a tarball built from
 *                        this working tree, so the tests are offline and
 *                        hermetic but still exercise the real code path
 *                        (curl | tar --strip-components=1).
 *
 * Run: node scripts/test-install.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// ─── Helpers ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let warnings = 0;
const failures = [];

function pass(msg) {
  process.stdout.write(`  ✅ ${msg}\n`);
  passed++;
}

function fail(msg) {
  process.stdout.write(`  ❌ ${msg}\n`);
  failed++;
  failures.push(msg);
}

function warn(msg) {
  process.stdout.write(`  ⚠️  ${msg}\n`);
  warnings++;
}

function section(title) {
  process.stdout.write(`\n━━━ ${title} ${'─'.repeat(Math.max(0, 55 - title.length))}\n`);
}

function check(cond, okMsg, failMsg) {
  if (cond) pass(okMsg);
  else fail(failMsg || okMsg);
  return !!cond;
}

function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (e) {
    return null;
  }
}

const ROOT = path.resolve(__dirname, '..');
const INSTALL_SH = path.join(ROOT, 'install.sh');
const BUILD_SITE = path.join(ROOT, 'site/build/build-site.js');
const PROMPTS_DIR = path.join(ROOT, 'prompts');
const SKILLS_DIR = path.join(ROOT, 'plugins/us-stock-analysis/skills');

// report-generator is an output tool, not an analysis framework — the installer
// reports one less than the number of prompt files it copies.
const registry = require('./lib/skill-registry');
const OUTPUT_ONLY = [...registry.OUTPUT_TOOLS];

const script = readFile(INSTALL_SH);
if (script === null) {
  process.stdout.write('\n❌ install.sh not found — nothing to test.\n\n');
  process.exit(1);
}

const promptNames = fs.readdirSync(PROMPTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace(/\.md$/, ''))
  .sort();
const skillDirs = fs.readdirSync(SKILLS_DIR)
  .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();
// Advertised frameworks = prompts − output tools − alias/redirect stubs (see skill-registry.js)
const ADVERTISED = registry.frameworkCount(promptNames);
const ALIAS_COUNT = promptNames.filter(n => registry.ALIAS_SKILLS.includes(n)).length;

// ─── Test 1: Script Shape ───────────────────────────────────────────────────

section('1. install.sh — Script Shape');

check(script.startsWith('#!/usr/bin/env bash'),
  'install.sh — bash shebang',
  `install.sh — expected '#!/usr/bin/env bash' shebang, got '${script.split('\n')[0]}'`);

check(/^set -euo pipefail$/m.test(script),
  'install.sh — set -euo pipefail (strict mode)',
  'install.sh — missing `set -euo pipefail`');

try {
  const mode = fs.statSync(INSTALL_SH).mode;
  check((mode & 0o111) !== 0,
    'install.sh — executable bit set',
    'install.sh — not executable (chmod +x install.sh)');
} catch (e) {
  fail(`install.sh — cannot stat: ${e.message}`);
}

// Syntax must parse under bash before anything else is worth testing.
const syntax = spawnSync('bash', ['-n', INSTALL_SH], { encoding: 'utf8' });
check(syntax.status === 0,
  'install.sh — parses cleanly (bash -n)',
  `install.sh — syntax error: ${(syntax.stderr || '').trim()}`);

// A destructive rm must only ever touch the script's own mktemp dir.
const rmLines = script.split('\n')
  .map((line, i) => ({ line, n: i + 1 }))
  .filter(({ line }) => /\brm\s+-[rf]{1,2}\b/.test(line));
const unsafeRm = rmLines.filter(({ line }) =>
  !/\$\{?TMP\}?/.test(line) && !/^\s*(info|say|ok)\s/.test(line));
check(unsafeRm.length === 0,
  `install.sh — every rm -rf targets $TMP only (${rmLines.length} checked)`,
  `install.sh — rm -rf on a non-temp path: ${unsafeRm.map(r => `L${r.n}`).join(', ')}`);

check(/\bmktemp -d\b/.test(script) && /trap .*rm -rf .*TMP.*EXIT/.test(script),
  'install.sh — mktemp dir cleaned up via trap on EXIT',
  'install.sh — temp dir is not cleaned up on exit');

// ─── Test 2: Agent List & Wiring ────────────────────────────────────────────

section('2. install.sh — Agent List & Wiring');

const agentsMatch = script.match(/^AGENTS="([^"]+)"/m);
let agents = [];
if (agentsMatch) {
  agents = agentsMatch[1].trim().split(/\s+/);
  pass(`install.sh — AGENTS list found (${agents.length}): ${agents.join(', ')}`);
} else {
  fail('install.sh — no `AGENTS="..."` declaration found');
}

check(agents.length === new Set(agents).size,
  'install.sh — AGENTS list has no duplicates',
  'install.sh — AGENTS list contains duplicates');

check(agents.every(a => a === a.toLowerCase()),
  'install.sh — AGENTS ids are lowercase (input is lowercased before matching)',
  `install.sh — non-lowercase agent id(s): ${agents.filter(a => a !== a.toLowerCase()).join(', ')}`);

// Every agent must be handled by the per-agent wiring `case`, and the `-l`
// listing must document where it installs.
const wiringCase = script.slice(script.indexOf('case "$AGENT" in'));
const listBlock = (script.match(/list_agents\(\)\s*\{[\s\S]*?\nEOF/) || [''])[0];

agents.forEach(agent => {
  const handled = new RegExp(`^\\s*(\\w+\\|)*${agent}(\\|\\w+)*\\)`, 'm').test(wiringCase);
  check(handled,
    `install.sh — '${agent}' handled in the per-agent case block`,
    `install.sh — '${agent}' is accepted but has no branch in the wiring case block`);

  check(new RegExp(`^${agent}\\s`, 'm').test(listBlock),
    `install.sh -l — documents '${agent}'`,
    `install.sh -l — no row for '${agent}'`);
});

// The usage text must not hardcode an agent list that can drift.
const usageBlock = (script.match(/usage\(\)\s*\{[\s\S]*?\nEOF/) || [''])[0];
check(usageBlock.includes('$AGENTS'),
  'install.sh -h — agent list is interpolated from $AGENTS (cannot drift)',
  'install.sh -h — hardcodes the agent list instead of using $AGENTS');

// Marker block used for idempotent appends.
const markBegin = (script.match(/^MARK_BEGIN="(.+)"$/m) || [])[1];
const markEnd = (script.match(/^MARK_END="(.+)"$/m) || [])[1];
check(!!markBegin && !!markEnd,
  `install.sh — begin/end markers defined (${markBegin} … ${markEnd})`,
  'install.sh — MARK_BEGIN / MARK_END not both defined');

check(!!markBegin && script.includes(`grep -qF "$MARK_BEGIN"`),
  'install.sh — checks for an existing marker before appending (idempotent)',
  'install.sh — appends without checking for an existing marker');

// ─── Test 3: Parity with the site installer picker ──────────────────────────

section('3. Parity — install.sh ↔ site INSTALL_TARGETS');

const buildSite = readFile(BUILD_SITE);
if (!buildSite) {
  fail('site/build/build-site.js — not found');
} else {
  const targetsBlock = (buildSite.match(/const INSTALL_TARGETS = \[[\s\S]*?\n\];/) || [''])[0];
  const targetIds = [...targetsBlock.matchAll(/id:\s*'([a-z]+)'/g)].map(m => m[1]);

  if (targetIds.length === 0) {
    fail('build-site.js — INSTALL_TARGETS not found or has no ids');
  } else {
    const missingOnSite = agents.filter(a => !targetIds.includes(a));
    const extraOnSite = targetIds.filter(t => !agents.includes(t));
    check(missingOnSite.length === 0,
      `build-site.js — every install.sh agent has an install tab (${targetIds.length})`,
      `build-site.js — INSTALL_TARGETS missing agent(s): ${missingOnSite.join(', ')}`);
    check(extraOnSite.length === 0,
      'build-site.js — no install tab for an unsupported agent',
      `build-site.js — INSTALL_TARGETS offers agent(s) install.sh rejects: ${extraOnSite.join(', ')}`);
  }

  // The paths advertised on the site must match what install.sh writes.
  const SITE_PATH_EXPECT = {
    claude: '.claude/skills',
    cursor: '.cursor/rules/investskill.mdc',
    copilot: '.github/copilot-instructions.md',
    gemini: 'GEMINI.md',
    codex: 'AGENTS.md',
    opencode: 'AGENTS.md',
    any: '.investskill/prompts',
  };
  const badPaths = [];
  for (const m of targetsBlock.matchAll(/id:\s*'([a-z]+)'[\s\S]*?path:\s*'([^']+)'/g)) {
    const [, id, p] = m;
    const expect = SITE_PATH_EXPECT[id];
    if (expect && !p.includes(expect)) badPaths.push(`${id}: site says '${p}', install.sh writes '${expect}'`);
  }
  check(badPaths.length === 0,
    'build-site.js — advertised install paths match install.sh',
    `build-site.js — install path mismatch → ${badPaths.join('; ')}`);
}

// ─── Test 4: Documented curl commands ───────────────────────────────────────

section('4. Docs — curl commands reference real agents');

const DOC_FILES = [
  'README.md',
  'README-zh-TW.md',
  'README-claude-code.md',
  'README-cursor.md',
  'README-gemini.md',
  'README-ollama.md',
  'site/content/COOKBOOK.md',
  'site/content/COOKBOOK-zh-TW.md',
];

let docCmdCount = 0;
DOC_FILES.forEach(rel => {
  const content = readFile(path.join(ROOT, rel));
  if (content === null) { warn(`${rel} — not found, skipped`); return; }

  const cmds = [...content.matchAll(/curl -fsSL (\S*install\.sh)([^\n`]*)/g)];
  if (cmds.length === 0) { warn(`${rel} — no install.sh curl command`); return; }
  docCmdCount += cmds.length;

  const badUrl = cmds
    .map(m => m[1])
    .filter(u => !/^https:\/\/raw\.githubusercontent\.com\/yennanliu\/InvestSkill\/[^/]+\/install\.sh$/.test(u));
  check(badUrl.length === 0,
    `${rel} — ${cmds.length} curl command(s) use the raw.githubusercontent URL`,
    `${rel} — bad install URL(s): ${[...new Set(badUrl)].join(', ')}`);

  // Any `-a AGENT` used in docs must be a supported agent (AGENT/<agent> is a
  // documented placeholder).
  const bad = [];
  cmds.forEach(m => {
    const flags = m[2];
    for (const f of flags.matchAll(/-a\s+([A-Za-z<>-]+)/g)) {
      const a = f[1];
      if (a === 'AGENT' || a === '<agent>') continue;
      if (!agents.includes(a.toLowerCase())) bad.push(a);
    }
  });
  check(bad.length === 0,
    `${rel} — all -a agents supported`,
    `${rel} — documents unsupported agent(s): ${[...new Set(bad)].join(', ')}`);
});
check(docCmdCount > 0,
  `Docs — ${docCmdCount} curl install command(s) checked`,
  'Docs — no curl install commands found anywhere');

// ─── Behaviour test harness ─────────────────────────────────────────────────
//
// install.sh fetches with `curl … | tar -xzf - --strip-components=1`. We put a
// `curl` test double first on PATH which streams a locally built tarball, so
// the real download/extract/copy/wire path runs with no network.

section('5. Behaviour — Harness Setup');

const WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'investskill-install-test-'));
const FAKE_BIN = path.join(WORK, 'bin');
const FIXTURES = path.join(WORK, 'fixtures');
fs.mkdirSync(FAKE_BIN, { recursive: true });
fs.mkdirSync(FIXTURES, { recursive: true });

let cleanupWork = true;
process.on('exit', () => {
  if (cleanupWork) fs.rmSync(WORK, { recursive: true, force: true });
});

/** Build a `<prefix>/…` tarball so --strip-components=1 lands on the contents. */
function buildFixture(name, { prompts = true, skills = true, emptyPrompts = false } = {}) {
  const stage = path.join(FIXTURES, `${name}-stage`);
  const top = path.join(stage, 'InvestSkill-fixture');
  fs.rmSync(stage, { recursive: true, force: true });
  fs.mkdirSync(top, { recursive: true });

  if (emptyPrompts) fs.mkdirSync(path.join(top, 'prompts'), { recursive: true });
  else if (prompts) fs.cpSync(PROMPTS_DIR, path.join(top, 'prompts'), { recursive: true });
  if (skills) {
    fs.cpSync(SKILLS_DIR, path.join(top, 'plugins/us-stock-analysis/skills'), { recursive: true });
  }
  // Something must exist at the top level even in the degenerate fixtures.
  fs.writeFileSync(path.join(top, 'README.md'), '# fixture\n');

  const tarball = path.join(FIXTURES, `${name}.tar.gz`);
  const r = spawnSync('tar', ['-czf', tarball, '-C', stage, 'InvestSkill-fixture'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`tar failed for fixture ${name}: ${r.stderr}`);
  return tarball;
}

const FIXTURE_FULL = buildFixture('full');
const FIXTURE_NO_PROMPTS = buildFixture('no-prompts', { prompts: false });
const FIXTURE_NO_SKILLS = buildFixture('no-skills', { skills: false });
const FIXTURE_EMPTY_PROMPTS = buildFixture('empty-prompts', { emptyPrompts: true });
pass('Fixtures — built full / no-prompts / no-skills / empty-prompts tarballs from the working tree');

// The curl double: serves $FAKE_CURL_TARBALL for the codeload URL, logs every
// invocation, and fails like curl would when $FAKE_CURL_FAIL is set.
fs.writeFileSync(path.join(FAKE_BIN, 'curl'), `#!/bin/sh
# curl test double for install.sh tests
printf '%s\\n' "$*" >> "$FAKE_CURL_LOG"
if [ -n "\${FAKE_CURL_FAIL:-}" ]; then
  echo "curl: (22) simulated HTTP failure" >&2
  exit 22
fi
for arg in "$@"; do
  case "$arg" in
    *codeload.github.com*|*githubusercontent.com*) exec cat "$FAKE_CURL_TARBALL" ;;
  esac
done
echo "curl double: unexpected invocation: $*" >&2
exit 99
`, { mode: 0o755 });
pass('Harness — curl test double installed on PATH');

let runSeq = 0;
/**
 * Run install.sh in a fresh sandbox.
 * @returns {{status:number, stdout:string, stderr:string, dir:string, home:string, curlLog:string}}
 */
function runInstall(args, opts = {}) {
  const { tarball = FIXTURE_FULL, fail: curlFail = false, dir, seed } = opts;
  const sandbox = path.join(WORK, `run${++runSeq}`);
  const projectDir = path.join(sandbox, 'project');
  const home = path.join(sandbox, 'home');
  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  if (seed) {
    for (const [rel, content] of Object.entries(seed)) {
      const target = path.join(projectDir, rel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    }
  }

  const curlLog = path.join(sandbox, 'curl.log');
  fs.writeFileSync(curlLog, '');

  const targetDir = dir === null ? null : (dir || projectDir);
  const argv = targetDir ? [INSTALL_SH, ...args, '-d', targetDir] : [INSTALL_SH, ...args];

  const r = spawnSync('bash', argv, {
    encoding: 'utf8',
    cwd: projectDir,
    env: {
      ...process.env,
      PATH: `${FAKE_BIN}${path.delimiter}${process.env.PATH}`,
      HOME: home,
      FAKE_CURL_TARBALL: tarball,
      FAKE_CURL_LOG: curlLog,
      ...(curlFail ? { FAKE_CURL_FAIL: '1' } : {}),
      TERM: 'dumb',
    },
    timeout: 120000,
  });

  return {
    status: r.status,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    dir: projectDir,
    home,
    curlLog: readFile(curlLog) || '',
  };
}

const exists = (...p) => fs.existsSync(path.join(...p));
const countOccurrences = (haystack, needle) => haystack.split(needle).length - 1;

// ─── Test 6: Flags & Validation ─────────────────────────────────────────────

section('6. Behaviour — Flags & Input Validation');

{
  const r = runInstall(['-h'], { dir: null });
  check(r.status === 0 && /InvestSkill installer/.test(r.stdout),
    'install.sh -h — prints usage and exits 0',
    `install.sh -h — status ${r.status}, stdout: ${r.stdout.slice(0, 120)}`);
  check(agents.every(a => r.stdout.includes(a)),
    'install.sh -h — usage names every supported agent',
    `install.sh -h — usage omits agent(s): ${agents.filter(a => !r.stdout.includes(a)).join(', ')}`);
  check(r.curlLog.trim() === '',
    'install.sh -h — exits before any download',
    'install.sh -h — downloaded something before printing help');
}

{
  const r = runInstall(['-l'], { dir: null });
  check(r.status === 0, 'install.sh -l — exits 0', `install.sh -l — status ${r.status}`);
  const missing = agents.filter(a => !new RegExp(`^${a}\\s`, 'm').test(r.stdout));
  check(missing.length === 0,
    `install.sh -l — lists all ${agents.length} agents with their install target`,
    `install.sh -l — missing agent row(s): ${missing.join(', ')}`);
  check(r.curlLog.trim() === '',
    'install.sh -l — exits before any download',
    'install.sh -l — downloaded something before listing agents');
}

{
  const r = runInstall(['-a', 'notanagent']);
  check(r.status !== 0 && /Unsupported agent/.test(r.stderr),
    'install.sh -a bogus — fails with "Unsupported agent"',
    `install.sh -a bogus — status ${r.status}, stderr: ${r.stderr.slice(0, 120)}`);
  check(!exists(r.dir, '.investskill'),
    'install.sh -a bogus — writes nothing',
    'install.sh -a bogus — created .investskill/ despite failing');
}

{
  const r = runInstall(['-Z']);
  check(r.status !== 0 && /Unknown option/.test(r.stderr),
    'install.sh -Z — rejects an unknown flag',
    `install.sh -Z — status ${r.status}, stderr: ${r.stderr.slice(0, 120)}`);
}

{
  // -a with no value: getopts reports a missing argument.
  const r = runInstall(['-a'], { dir: null });
  check(r.status !== 0 && /needs a value/.test(r.stderr),
    'install.sh -a (no value) — fails with a "needs a value" message',
    `install.sh -a (no value) — status ${r.status}, stderr: ${r.stderr.slice(0, 120)}`);
}

{
  const r = runInstall(['-a', 'CLAUDE']);
  check(r.status === 0 && exists(r.dir, '.claude/skills'),
    'install.sh -a CLAUDE — agent name is case-insensitive',
    `install.sh -a CLAUDE — status ${r.status}, stderr: ${r.stderr.slice(0, 200)}`);
}

{
  const r = runInstall(['-a', 'any', '-r', 'v9.9.9-test']);
  check(/tar\.gz\/v9\.9\.9-test/.test(r.curlLog),
    'install.sh -r REF — the ref reaches the download URL',
    `install.sh -r REF — URL did not carry the ref: ${r.curlLog.trim().slice(0, 200)}`);
}

{
  const nested = path.join(WORK, 'created', 'by', 'installer');
  const r = runInstall(['-a', 'any'], { dir: nested });
  check(r.status === 0 && fs.existsSync(path.join(nested, '.investskill/prompts')),
    'install.sh -d DIR — creates a missing target directory',
    `install.sh -d DIR — status ${r.status}, stderr: ${r.stderr.slice(0, 200)}`);
}

{
  const r = runInstall(['-a', 'any', '-g'], { dir: null });
  check(r.status === 0 && exists(r.home, '.investskill/prompts'),
    'install.sh -g — installs into $HOME instead of the project',
    `install.sh -g — status ${r.status}, stderr: ${r.stderr.slice(0, 200)}`);
  check(!exists(r.dir, '.investskill'),
    'install.sh -g — leaves the project directory untouched',
    'install.sh -g — also wrote into the project directory');
}

// ─── Test 7: Prompt Payload ─────────────────────────────────────────────────

section('7. Behaviour — Framework Payload');

{
  const r = runInstall(['-a', 'any']);
  const promptsPath = path.join(r.dir, '.investskill/prompts');
  if (!check(r.status === 0, 'install.sh -a any — exits 0', `install.sh -a any — status ${r.status}, stderr: ${r.stderr.slice(0, 200)}`)) {
    // nothing else to assert
  } else {
    const installed = fs.readdirSync(promptsPath).filter(f => f.endsWith('.md')).sort();
    check(installed.length === promptNames.length,
      `install.sh — copies all ${promptNames.length} prompt files`,
      `install.sh — copied ${installed.length} prompts, expected ${promptNames.length}`);

    const missing = promptNames.filter(n => !installed.includes(`${n}.md`));
    check(missing.length === 0,
      'install.sh — no framework missing from .investskill/prompts/',
      `install.sh — missing prompt(s): ${missing.join(', ')}`);

    check(new RegExp(`^\\s*✓?\\s*${ADVERTISED} analysis frameworks`, 'm').test(r.stdout),
      `install.sh — reports ${ADVERTISED} analysis frameworks (excludes ${ALIAS_COUNT} aliases + ${OUTPUT_ONLY.length} output tools)`,
      `install.sh — did not report ${ADVERTISED} frameworks. stdout: ${r.stdout.slice(0, 300)}`);

    const sample = readFile(path.join(promptsPath, 'stock-eval.md')) || '';
    check(sample.includes('INVESTMENT SIGNAL'),
      'install.sh — installed prompts keep their Investment Signal Block',
      'install.sh — installed stock-eval.md lost its INVESTMENT SIGNAL block');

    // `any` is prompts-only: no agent config may be written.
    const strays = ['.claude', '.cursor', 'GEMINI.md', 'AGENTS.md', '.github/copilot-instructions.md']
      .filter(p => exists(r.dir, p));
    check(strays.length === 0,
      'install.sh -a any — writes prompts only, no agent config',
      `install.sh -a any — unexpected file(s): ${strays.join(', ')}`);
  }
}

// ─── Test 8: Per-Agent Wiring ───────────────────────────────────────────────

section('8. Behaviour — Per-Agent Wiring');

{
  const r = runInstall(['-a', 'claude']);
  check(r.status === 0, 'install.sh -a claude — exits 0', `install.sh -a claude — status ${r.status}, stderr: ${r.stderr.slice(0, 200)}`);
  const installedSkills = exists(r.dir, '.claude/skills')
    ? fs.readdirSync(path.join(r.dir, '.claude/skills')).sort()
    : [];
  check(installedSkills.length === skillDirs.length,
    `install.sh -a claude — installs all ${skillDirs.length} skills into .claude/skills/`,
    `install.sh -a claude — installed ${installedSkills.length} skills, expected ${skillDirs.length}`);

  const noSkillMd = installedSkills.filter(s => !exists(r.dir, '.claude/skills', s, 'SKILL.md'));
  check(noSkillMd.length === 0,
    'install.sh -a claude — every installed skill has a SKILL.md',
    `install.sh -a claude — skill(s) without SKILL.md: ${noSkillMd.join(', ')}`);

  const skillMd = readFile(path.join(r.dir, '.claude/skills/stock-eval/SKILL.md')) || '';
  check(skillMd.startsWith('---'),
    'install.sh -a claude — installed SKILL.md keeps its YAML frontmatter',
    'install.sh -a claude — installed stock-eval/SKILL.md lost its frontmatter');
}

{
  const r = runInstall(['-a', 'cursor']);
  const mdc = readFile(path.join(r.dir, '.cursor/rules/investskill.mdc'));
  check(r.status === 0 && mdc !== null,
    'install.sh -a cursor — creates .cursor/rules/investskill.mdc',
    `install.sh -a cursor — status ${r.status}, stderr: ${r.stderr.slice(0, 200)}`);
  if (mdc) {
    check(mdc.startsWith('---\n'),
      'install.sh -a cursor — .mdc starts with MDC frontmatter',
      'install.sh -a cursor — .mdc missing leading `---`');
    ['description:', 'globs:', 'alwaysApply:'].forEach(field => {
      check(mdc.includes(field),
        `install.sh -a cursor — .mdc has ${field}`,
        `install.sh -a cursor — .mdc missing ${field}`);
    });
    check(mdc.includes(markBegin) && mdc.includes(markEnd),
      'install.sh -a cursor — .mdc carries the InvestSkill marker block',
      'install.sh -a cursor — .mdc missing marker block');
  }
}

const WIRED_FILES = {
  copilot: '.github/copilot-instructions.md',
  gemini: 'GEMINI.md',
  codex: 'AGENTS.md',
  opencode: 'AGENTS.md',
};

Object.entries(WIRED_FILES).forEach(([agent, rel]) => {
  const r = runInstall(['-a', agent]);
  const content = readFile(path.join(r.dir, rel));
  check(r.status === 0 && content !== null,
    `install.sh -a ${agent} — creates ${rel}`,
    `install.sh -a ${agent} — ${rel} not created (status ${r.status}): ${r.stderr.slice(0, 200)}`);
  if (content) {
    check(content.includes(markBegin) && content.includes(markEnd),
      `install.sh -a ${agent} — ${rel} has both markers`,
      `install.sh -a ${agent} — ${rel} missing a marker`);
    check(content.includes('.investskill/prompts/stock-eval.md'),
      `install.sh -a ${agent} — ${rel} points at the installed frameworks`,
      `install.sh -a ${agent} — ${rel} does not reference the prompts path`);
    check(/not financial advice/i.test(content),
      `install.sh -a ${agent} — ${rel} carries the educational disclaimer`,
      `install.sh -a ${agent} — ${rel} missing the disclaimer`);
    const listed = promptNames.filter(n => content.includes(`.investskill/prompts/${n}.md`));
    check(listed.length === promptNames.length,
      `install.sh -a ${agent} — ${rel} lists all ${promptNames.length} frameworks`,
      `install.sh -a ${agent} — ${rel} lists ${listed.length}/${promptNames.length} frameworks`);
  }
});

// ─── Test 9: Non-Destructive & Idempotent ───────────────────────────────────

section('9. Behaviour — Non-Destructive & Idempotent');

{
  const original = '# My project instructions\n\nAlways use tabs.\n';
  const r = runInstall(['-a', 'copilot'], {
    seed: { '.github/copilot-instructions.md': original },
  });
  const wired = readFile(path.join(r.dir, '.github/copilot-instructions.md')) || '';
  check(r.status === 0 && wired.startsWith(original),
    'install.sh — appends to an existing instructions file, preserving its content',
    `install.sh — existing copilot-instructions.md content was not preserved (status ${r.status})`);
  check(wired.includes(markBegin),
    'install.sh — appended block is marked',
    'install.sh — appended block is not marked');
  check(/Appended InvestSkill block/.test(r.stdout),
    'install.sh — reports the append instead of a create',
    `install.sh — did not report an append. stdout: ${r.stdout.slice(0, 300)}`);
}

{
  // Re-run into the same directory: nothing may be duplicated.
  const sandbox = path.join(WORK, 'idempotent');
  fs.mkdirSync(sandbox, { recursive: true });
  const first = runInstall(['-a', 'gemini'], { dir: sandbox });
  const afterFirst = readFile(path.join(sandbox, 'GEMINI.md')) || '';
  const second = runInstall(['-a', 'gemini'], { dir: sandbox });
  const afterSecond = readFile(path.join(sandbox, 'GEMINI.md')) || '';

  check(first.status === 0 && second.status === 0,
    'install.sh — re-running succeeds',
    `install.sh — re-run failed (first ${first.status}, second ${second.status}): ${second.stderr.slice(0, 200)}`);
  check(afterSecond === afterFirst,
    'install.sh — re-run leaves the wired file byte-identical',
    'install.sh — re-run modified the already-wired file');
  check(countOccurrences(afterSecond, markBegin) === 1,
    'install.sh — exactly one marker block after two runs (no duplication)',
    `install.sh — ${countOccurrences(afterSecond, markBegin)} marker blocks after two runs`);
  check(/already wired/.test(second.stdout),
    'install.sh — reports the file as already wired',
    `install.sh — no "already wired" notice on re-run. stdout: ${second.stdout.slice(0, 300)}`);

  const promptCount = fs.readdirSync(path.join(sandbox, '.investskill/prompts')).filter(f => f.endsWith('.md')).length;
  check(promptCount === promptNames.length,
    'install.sh — re-run keeps the prompt payload intact',
    `install.sh — ${promptCount} prompts after re-run, expected ${promptNames.length}`);
}

{
  // Whole-tree idempotency for the heaviest agent: skills are copied with
  // `cp -R`, so a re-run must still leave every file byte-identical.
  const sandbox = path.join(WORK, 'idempotent-claude');
  fs.mkdirSync(sandbox, { recursive: true });
  const hashTree = (root) => {
    const out = [];
    const walk = (dir, rel) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const abs = path.join(dir, e.name);
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) walk(abs, r);
        else out.push(`${r}:${require('crypto').createHash('sha256').update(fs.readFileSync(abs)).digest('hex')}`);
      }
    };
    walk(root, '');
    return out.join('\n');
  };

  const first = runInstall(['-a', 'claude'], { dir: sandbox });
  const treeAfterFirst = hashTree(sandbox);
  const second = runInstall(['-a', 'claude'], { dir: sandbox });
  const treeAfterSecond = hashTree(sandbox);

  check(first.status === 0 && second.status === 0,
    'install.sh -a claude — re-running succeeds',
    `install.sh -a claude — re-run failed (first ${first.status}, second ${second.status}): ${second.stderr.slice(0, 200)}`);
  check(treeAfterSecond === treeAfterFirst,
    'install.sh -a claude — re-run leaves the whole tree byte-identical',
    'install.sh -a claude — re-run changed installed files');
}

// ─── Test 10: Failure Modes ─────────────────────────────────────────────────

section('10. Behaviour — Failure Modes');

{
  const r = runInstall(['-a', 'claude'], { fail: true });
  check(r.status !== 0 && /Download failed/.test(r.stderr),
    'install.sh — a failed download exits non-zero with a clear message',
    `install.sh — download failure not handled (status ${r.status}): ${r.stderr.slice(0, 200)}`);
  check(!exists(r.dir, '.claude') && !exists(r.dir, '.investskill'),
    'install.sh — a failed download leaves the project clean',
    'install.sh — partial install left behind after a failed download');
}

{
  const r = runInstall(['-a', 'any'], { tarball: FIXTURE_NO_PROMPTS });
  check(r.status !== 0 && /no prompts\/ directory/.test(r.stderr),
    'install.sh — rejects an archive without prompts/',
    `install.sh — accepted an archive with no prompts/ (status ${r.status}): ${r.stderr.slice(0, 200)}`);
}

{
  const r = runInstall(['-a', 'claude'], { tarball: FIXTURE_NO_SKILLS });
  check(r.status !== 0 && /no skills\/ directory/.test(r.stderr),
    'install.sh -a claude — rejects an archive without skills/',
    `install.sh -a claude — accepted an archive with no skills/ (status ${r.status}): ${r.stderr.slice(0, 200)}`);
}

{
  // An empty prompts/ must never be reported as a payload. The unmatched glob
  // in the framework counter would otherwise count its own literal as a file.
  const r = runInstall(['-a', 'any'], { tarball: FIXTURE_EMPTY_PROMPTS });
  check(r.status !== 0,
    'install.sh — an archive with an empty prompts/ fails instead of installing nothing',
    `install.sh — exited 0 on an empty prompts/ payload. stdout: ${r.stdout.slice(0, 200)}`);
  check(!/[1-9]\d* analysis frameworks/.test(r.stdout),
    'install.sh — never reports a phantom framework count for an empty payload',
    `install.sh — reported a framework count with no frameworks: ${r.stdout.slice(0, 200)}`);
}

{
  // No colour escapes when stdout is a pipe (all output is captured here).
  const r = runInstall(['-a', 'any']);
  check(!/\[/.test(r.stdout),
    'install.sh — no ANSI escapes when stdout is not a TTY',
    'install.sh — emits ANSI escapes into a non-TTY stdout');
}

// ─── Final Summary ───────────────────────────────────────────────────────────

if (process.env.KEEP_INSTALL_TEST_DIR) {
  cleanupWork = false;
  process.stdout.write(`\n  (kept sandbox: ${WORK})\n`);
}

process.stdout.write('\n' + '═'.repeat(60) + '\n');
process.stdout.write('  INSTALL SCRIPT TEST RESULTS\n');
process.stdout.write('═'.repeat(60) + '\n');
process.stdout.write(`  ✅ Passed:   ${passed}\n`);
process.stdout.write(`  ❌ Failed:   ${failed}\n`);
process.stdout.write(`  ⚠️  Warnings: ${warnings}\n`);
process.stdout.write('═'.repeat(60) + '\n');

if (failed > 0) {
  process.stdout.write('\nFailed tests:\n');
  failures.forEach((f, i) => process.stdout.write(`  ${i + 1}. ${f}\n`));
  process.stdout.write('\n');
  process.exit(1);
} else {
  process.stdout.write('\n  🎉 All install script tests passed!\n\n');
  process.exit(0);
}
