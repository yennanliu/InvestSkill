#!/usr/bin/env node
/**
 * InvestSkill Unit Test Suite
 * Tests skill content quality, prompts sync, and cross-AI compatibility
 * Run: node scripts/test-skills.js
 */

const fs = require('fs');
const path = require('path');

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

function readJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (e) {
    return null;
  }
}

function fileExists(filepath) {
  return fs.existsSync(filepath);
}

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'plugins/us-stock-analysis/skills');
const PROMPTS_DIR = path.join(ROOT, 'prompts');
const PLUGIN_JSON = path.join(ROOT, 'plugins/us-stock-analysis/.claude-plugin/plugin.json');
const MARKETPLACE_JSON = path.join(ROOT, '.claude-plugin/marketplace.json');

// Skills excluded from specific checks
const PROMPTS_EXCLUDED = ['report-generator'];  // HTML output tool, not an analysis prompt
const SIGNAL_EXCLUDED  = ['report-generator'];  // Renders signal blocks in HTML, doesn't produce them

const SIGNAL_BLOCK = '╔══════════════════════════════════════════════╗';
const FRONTMATTER_START = /^---\s*$/m;
const DESCRIPTION_FIELD = /^description:\s*.+/m;

// ─── Test 1: JSON Syntax Validation ─────────────────────────────────────────

section('1. JSON Syntax Validation');

const marketplace = readJSON(MARKETPLACE_JSON);
if (marketplace) {
  pass('marketplace.json — valid JSON');
} else {
  fail('marketplace.json — invalid JSON or missing');
}

const pluginJson = readJSON(PLUGIN_JSON);
if (pluginJson) {
  pass('plugin.json — valid JSON');
} else {
  fail('plugin.json — invalid JSON or missing');
}

// ─── Test 2: Plugin Manifest Fields ─────────────────────────────────────────

section('2. Plugin Manifest Required Fields');

if (marketplace) {
  ['name', 'owner', 'metadata', 'plugins'].forEach(field => {
    if (marketplace[field] !== undefined) {
      pass(`marketplace.json has field: "${field}"`);
    } else {
      fail(`marketplace.json missing required field: "${field}"`);
    }
  });

  if (marketplace.metadata && marketplace.metadata.version) {
    pass(`marketplace.json version: ${marketplace.metadata.version}`);
  } else {
    fail('marketplace.json missing metadata.version');
  }
}

if (pluginJson) {
  ['name', 'description', 'version', 'author'].forEach(field => {
    if (pluginJson[field] !== undefined) {
      pass(`plugin.json has field: "${field}"`);
    } else {
      fail(`plugin.json missing required field: "${field}"`);
    }
  });
}

// ─── Test 3: Version Consistency ────────────────────────────────────────────

section('3. Version Consistency');

if (marketplace && pluginJson) {
  const marketplacePluginEntry = marketplace.plugins &&
    marketplace.plugins.find(p => p.name === pluginJson.name);

  if (marketplacePluginEntry) {
    if (marketplacePluginEntry.version === pluginJson.version) {
      pass(`Versions match: marketplace.json (${marketplacePluginEntry.version}) = plugin.json (${pluginJson.version})`);
    } else {
      fail(`Version mismatch: marketplace.json has ${marketplacePluginEntry.version}, plugin.json has ${pluginJson.version}`);
    }
    if (marketplace.metadata.version === pluginJson.version) {
      pass(`Metadata version matches: ${marketplace.metadata.version}`);
    } else {
      warn(`Metadata version (${marketplace.metadata.version}) differs from plugin version (${pluginJson.version})`);
    }
  } else {
    fail(`Plugin "${pluginJson.name}" not found in marketplace.json plugins array`);
  }
}

// ─── Test 4: Skills Registry — plugin.json ↔ Directories ───────────────────

section('4. Skills Registry (plugin.json ↔ Directories)');

// Skills are auto-discovered from the skills/ directory (no skills[] in plugin.json)
const actualSkillDirs = fs.existsSync(SKILLS_DIR)
  ? fs.readdirSync(SKILLS_DIR).filter(d =>
      fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
    )
  : [];
const registeredSkills = actualSkillDirs;

// Validate plugin.json does NOT have a bare-name skills[] (invalid schema)
if (pluginJson && Array.isArray(pluginJson.skills)) {
  const first = pluginJson.skills[0];
  if (typeof first === 'string' && !first.startsWith('./')) {
    fail('plugin.json has skills[] with bare names — must be omitted or use path strings (./...)');
  } else {
    pass('plugin.json skills field uses path format');
  }
} else {
  pass('plugin.json skills field absent — auto-discovery from skills/ directory');
}

// Every skill directory must have a SKILL.md
actualSkillDirs.forEach(dir => {
  const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
  if (fs.existsSync(skillFile)) {
    pass(`"${dir}" — SKILL.md present`);
  } else {
    fail(`"${dir}" — directory exists but SKILL.md MISSING`);
  }
});

pass(`Total skills: ${actualSkillDirs.length} directories`);

// ─── Test 5: SKILL.md Quality Checks ────────────────────────────────────────

section('5. SKILL.md Quality Checks');

const MIN_SKILL_LINES = 50;
const MIN_SKILL_WORDS = 400;

registeredSkills.forEach(skill => {
  const skillFile = path.join(SKILLS_DIR, skill, 'SKILL.md');

  if (!fileExists(skillFile)) {
    fail(`${skill}/SKILL.md — file missing`);
    return;
  }

  const content = readFile(skillFile);
  const lines = content.split('\n').length;
  const words = content.split(/\s+/).filter(w => w.length > 0).length;

  // Check frontmatter
  if (FRONTMATTER_START.test(content)) {
    pass(`${skill}/SKILL.md — has frontmatter`);
  } else {
    fail(`${skill}/SKILL.md — missing frontmatter (--- block)`);
  }

  // Check description in frontmatter
  if (DESCRIPTION_FIELD.test(content)) {
    pass(`${skill}/SKILL.md — has description field`);
  } else {
    fail(`${skill}/SKILL.md — missing "description:" in frontmatter`);
  }

  // Check signal block (report-generator renders it in HTML, doesn't produce it)
  if (SIGNAL_EXCLUDED.includes(skill)) {
    pass(`${skill}/SKILL.md — signal block exempt (HTML output tool)`);
  } else if (content.includes(SIGNAL_BLOCK)) {
    pass(`${skill}/SKILL.md — has INVESTMENT SIGNAL block`);
  } else {
    fail(`${skill}/SKILL.md — missing INVESTMENT SIGNAL block`);
  }

  // Check minimum content
  if (lines >= MIN_SKILL_LINES) {
    pass(`${skill}/SKILL.md — content length OK (${lines} lines)`);
  } else {
    warn(`${skill}/SKILL.md — content may be too short (${lines} lines, min ${MIN_SKILL_LINES})`);
  }

  if (words >= MIN_SKILL_WORDS) {
    pass(`${skill}/SKILL.md — word count OK (${words} words)`);
  } else {
    fail(`${skill}/SKILL.md — low word count (${words} words, min ${MIN_SKILL_WORDS})`);
  }
});

// ─── Test 6: Prompts Sync Check ──────────────────────────────────────────────

section('6. Prompts Directory Sync (skill ↔ prompts/*.md)');


registeredSkills.forEach(skill => {
  if (PROMPTS_EXCLUDED.includes(skill)) {
    pass(`${skill} — excluded from prompts sync check (output tool)`);
    return;
  }

  const promptFile = path.join(PROMPTS_DIR, `${skill}.md`);
  if (fileExists(promptFile)) {
    pass(`prompts/${skill}.md — exists`);
  } else {
    fail(`prompts/${skill}.md — MISSING (skill registered but no universal prompt)`);
  }
});

// ─── Test 7: Prompts Quality Checks ─────────────────────────────────────────

section('7. Prompts Quality Checks');

const MIN_PROMPT_LINES = 30;

if (fs.existsSync(PROMPTS_DIR)) {
  const promptFiles = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md'));

  promptFiles.forEach(file => {
    const promptPath = path.join(PROMPTS_DIR, file);
    const content = readFile(promptPath);
    const lines = content.split('\n').length;
    const skillName = file.replace('.md', '');

    // Must NOT have YAML frontmatter (prompts are Claude Code-free)
    const frontmatterMatch = content.match(/^---\s*\n[\s\S]*?\n---/);
    if (!frontmatterMatch) {
      pass(`prompts/${file} — no Claude Code frontmatter (AI-agnostic ✓)`);
    } else {
      fail(`prompts/${file} — contains YAML frontmatter (should be AI-agnostic)`);
    }

    // Must have signal block
    if (content.includes(SIGNAL_BLOCK)) {
      pass(`prompts/${file} — has INVESTMENT SIGNAL block`);
    } else {
      fail(`prompts/${file} — missing INVESTMENT SIGNAL block`);
    }

    // Must have disclaimer
    if (content.includes('Not financial advice') || content.includes('not financial advice')) {
      pass(`prompts/${file} — has disclaimer`);
    } else {
      warn(`prompts/${file} — missing disclaimer ("Not financial advice")`);
    }

    // Minimum content
    if (lines >= MIN_PROMPT_LINES) {
      pass(`prompts/${file} — content length OK (${lines} lines)`);
    } else {
      warn(`prompts/${file} — content may be too short (${lines} lines, min ${MIN_PROMPT_LINES})`);
    }

    // Must NOT contain Claude Code slash command references like /skill-name
    const slashCommandPattern = /^\/[a-z-]+\s+[A-Z]{1,5}/m;
    if (!slashCommandPattern.test(content)) {
      pass(`prompts/${file} — no Claude Code slash commands (portable ✓)`);
    } else {
      warn(`prompts/${file} — may contain Claude Code slash command references`);
    }
  });

  pass(`Total prompt files: ${promptFiles.length}`);
}

// ─── Test 8: Cross-AI Files Validation ──────────────────────────────────────

section('8. Cross-AI Compatibility Files');

// GEMINI.md
const geminiPath = path.join(ROOT, 'GEMINI.md');
if (fileExists(geminiPath)) {
  pass('GEMINI.md — exists');
  const geminiContent = readFile(geminiPath);

  // Check that referenced prompt files exist
  const promptRefs = [...geminiContent.matchAll(/`prompts\/([a-z-]+\.md)`/g)].map(m => m[1]);
  promptRefs.forEach(ref => {
    const refPath = path.join(PROMPTS_DIR, ref);
    if (fileExists(refPath)) {
      pass(`GEMINI.md references prompts/${ref} — file exists`);
    } else {
      fail(`GEMINI.md references prompts/${ref} — FILE NOT FOUND`);
    }
  });

  if (geminiContent.includes('BULLISH') || geminiContent.includes('Signal')) {
    pass('GEMINI.md — mentions signal standards');
  } else {
    warn('GEMINI.md — consider adding signal output standards reference');
  }
} else {
  fail('GEMINI.md — missing');
}

// GitHub Copilot instructions
const copilotPath = path.join(ROOT, '.github/copilot-instructions.md');
if (fileExists(copilotPath)) {
  pass('.github/copilot-instructions.md — exists');
  const copilotContent = readFile(copilotPath);
  if (copilotContent.includes('prompts/')) {
    pass('.github/copilot-instructions.md — references prompts/ directory');
  } else {
    warn('.github/copilot-instructions.md — does not reference prompts/ directory');
  }
  if (copilotContent.includes('INVESTMENT SIGNAL') || copilotContent.includes('BULLISH')) {
    pass('.github/copilot-instructions.md — includes signal block standard');
  } else {
    warn('.github/copilot-instructions.md — consider adding signal block standard');
  }
} else {
  fail('.github/copilot-instructions.md — missing');
}

// Cursor rules
const cursorPath = path.join(ROOT, '.cursor/rules/invest-skill.mdc');
if (fileExists(cursorPath)) {
  pass('.cursor/rules/invest-skill.mdc — exists');
  const cursorContent = readFile(cursorPath);

  // Check MDC frontmatter
  if (cursorContent.includes('description:')) {
    pass('.cursor/rules/invest-skill.mdc — has "description" field');
  } else {
    fail('.cursor/rules/invest-skill.mdc — missing "description" field in frontmatter');
  }
  if (cursorContent.includes('alwaysApply:')) {
    pass('.cursor/rules/invest-skill.mdc — has "alwaysApply" field');
  } else {
    warn('.cursor/rules/invest-skill.mdc — missing "alwaysApply" field');
  }
  if (cursorContent.includes('prompts/')) {
    pass('.cursor/rules/invest-skill.mdc — references prompts/ directory');
  } else {
    warn('.cursor/rules/invest-skill.mdc — does not reference prompts/');
  }
} else {
  fail('.cursor/rules/invest-skill.mdc — missing');
}

// ─── Test 9: Cookbook Files ──────────────────────────────────────────────────

section('9. Cookbook Files');

const cookbookFiles = ['site/content/COOKBOOK.md', 'site/content/COOKBOOK-zh-TW.md'];
cookbookFiles.forEach(file => {
  const filePath = path.join(ROOT, file);
  if (fileExists(filePath)) {
    pass(`${file} — exists`);
    const content = readFile(filePath);
    const lines = content.split('\n').length;
    if (lines >= 100) {
      pass(`${file} — content length OK (${lines} lines)`);
    } else {
      warn(`${file} — content may be too short (${lines} lines)`);
    }
    // Check for 3 required sections (supports both English and Chinese headings)
    const sectionChecks = [
      { en: 'Setup', zh: '安裝指南' },
      { en: 'Core Concept', zh: '核心概念' },
      { en: 'Demo', zh: '示範' },
    ];
    sectionChecks.forEach(({ en, zh }) => {
      if (content.includes(en) || content.includes(zh)) {
        pass(`${file} — contains "${en}" / "${zh}" section`);
      } else {
        warn(`${file} — missing "${en}" / "${zh}" section`);
      }
    });
  } else {
    fail(`${file} — missing`);
  }
});

// ─── Test 10: Key Documentation Files ───────────────────────────────────────

section('10. Required Documentation Files');

['README.md', 'README-zh-TW.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE'].forEach(file => {
  const filePath = path.join(ROOT, file);
  if (fileExists(filePath)) {
    pass(`${file} — exists`);
  } else {
    fail(`${file} — missing`);
  }
});

// README should reference cookbook
const readmeContent = readFile(path.join(ROOT, 'README.md'));
if (readmeContent && readmeContent.includes('cookbook')) {
  pass('README.md — links to Cookbook');
} else {
  warn('README.md — does not link to Cookbook');
}

// CHANGELOG should mention current version
if (marketplace && readmeContent) {
  const version = marketplace.metadata.version;
  const changelogContent = readFile(path.join(ROOT, 'CHANGELOG.md'));
  if (changelogContent && changelogContent.includes(version)) {
    pass(`CHANGELOG.md — contains current version ${version}`);
  } else {
    warn(`CHANGELOG.md — may not contain current version ${version}`);
  }
}

// ─── Test 11: Consistency (counts & versions) ───────────────────────────────

section('11. Consistency — Counts & Versions');

// Skills ↔ prompts count parity (report-generator has a prompt too)
const skillCount  = actualSkillDirs.length;
const promptCount = fs.existsSync(PROMPTS_DIR)
  ? fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md')).length
  : 0;
if (skillCount === promptCount) {
  pass(`Skill dirs (${skillCount}) === prompt files (${promptCount})`);
} else {
  fail(`Count mismatch: ${skillCount} skill dirs vs ${promptCount} prompt files`);
}

// Advertised framework count = skills − output-only tools (report-generator)
const ADVERTISED = skillCount - PROMPTS_EXCLUDED.length;
pass(`Advertised framework count = ${ADVERTISED} (${skillCount} skills − ${PROMPTS_EXCLUDED.length} output tool)`);

// Version parity across package.json, plugin.json, marketplace (metadata + entry)
const pkg = readJSON(path.join(ROOT, 'package.json'));
const versions = {
  'package.json': pkg && pkg.version,
  'plugin.json': pluginJson && pluginJson.version,
  'marketplace.metadata': marketplace && marketplace.metadata && marketplace.metadata.version,
};
const entry = marketplace && marketplace.plugins &&
  marketplace.plugins.find(p => pluginJson && p.name === pluginJson.name);
if (entry) versions['marketplace.plugin-entry'] = entry.version;
const uniqueVersions = [...new Set(Object.values(versions).filter(Boolean))];
if (uniqueVersions.length === 1) {
  pass(`Versions match across all manifests: ${uniqueVersions[0]}`);
} else {
  fail(`Version drift: ${Object.entries(versions).map(([k, v]) => `${k}=${v}`).join(', ')}`);
}

// Framework-count claims in site-facing docs must all equal ADVERTISED.
// Numbers < 10 are treated as category sub-counts and ignored; any total
// (>= 10) stated next to "framework(s)" / "N 個 … 框架" must equal ADVERTISED.
const COUNT_DOCS = [
  'README.md', 'README-zh-TW.md',
  'site/content/CHOOSE-A-SKILL.md', 'site/content/CHOOSE-A-SKILL-zh-TW.md',
  'site/content/COOKBOOK.md', 'site/content/COOKBOOK-zh-TW.md',
];
const claimPatterns = [
  /\b(\d+)\s+(?:[A-Za-z-]+\s+){0,3}frameworks?\b/gi,   // "23 (structured analysis) frameworks"
  /(\d+)\s*個[^\n。，]{0,8}框架/g,                       // "23 個 … 框架"
  /框架[：:]\s*(\d+)\s*個/g,                             // "技能框架：23 個"
];
let countDrift = 0;
COUNT_DOCS.forEach(file => {
  const content = readFile(path.join(ROOT, file));
  if (!content) { warn(`${file} — not found for count check`); return; }
  const bad = [];
  claimPatterns.forEach(re => {
    for (const m of content.matchAll(re)) {
      const n = parseInt(m[1], 10);
      if (n >= 10 && n !== ADVERTISED) bad.push(`"${m[0].trim()}" (${n})`);
    }
  });
  if (bad.length) {
    countDrift++;
    fail(`${file} — stale framework count(s), expected ${ADVERTISED}: ${bad.join(', ')}`);
  } else {
    pass(`${file} — framework counts consistent (${ADVERTISED})`);
  }
});
if (countDrift === 0) pass(`All site-facing docs advertise ${ADVERTISED} frameworks`);

// ─── Test 12: bear-case Skill Contract ──────────────────────────────────────

section('12. bear-case Skill Contract (intentional one-sided design)');

// The bear-case skill is a deliberate red-team. These checks lock in the
// design guarantees so future edits can't quietly turn it into a balanced call.
const BEAR_SKILL = path.join(SKILLS_DIR, 'bear-case', 'SKILL.md');
const BEAR_PROMPT = path.join(PROMPTS_DIR, 'bear-case.md');

[
  { label: 'bear-case SKILL.md', file: BEAR_SKILL },
  { label: 'bear-case prompt', file: BEAR_PROMPT },
].forEach(({ label, file }) => {
  const content = readFile(file);
  if (!content) {
    fail(`${label} — file missing`);
    return;
  }

  // Must declare its one-sided / red-team nature (so it's never read as balanced)
  if (/one-sided/i.test(content)) {
    pass(`${label} — declares it is intentionally one-sided`);
  } else {
    fail(`${label} — must state it is deliberately one-sided`);
  }

  // Must contain the mandatory intellectual-honesty escape hatch
  if (/thesis-killers/i.test(content)) {
    pass(`${label} — includes mandatory Thesis-Killers section`);
  } else {
    fail(`${label} — missing "Thesis-Killers" section (what would prove the bear wrong)`);
  }

  // Must produce a Bear Case Strength score
  if (/bear case strength/i.test(content)) {
    pass(`${label} — defines Bear Case Strength score`);
  } else {
    fail(`${label} — missing "Bear Case Strength" scoring`);
  }

  // Must direct the user to pair it with a balanced/bull view
  if (/stock-eval|bull[- ]case|balanced/i.test(content)) {
    pass(`${label} — points user to a balanced/bull counterpart`);
  } else {
    fail(`${label} — should tell the user to pair it with a balanced view`);
  }
});

// ─── Test 13: Cross-AI Config Completeness & Count Consistency ───────────────

section('13. Cross-AI Config Completeness & Count Consistency');

// These guards exist because the cross-AI config files (not covered by the
// COUNT_DOCS check above) silently drifted: skills were missing from tables,
// and intro/header framework counts went stale. They now fail loudly.
const CROSS_AI_FILES = [
  { label: 'GEMINI.md',                        file: 'GEMINI.md' },
  { label: '.cursor/rules/invest-skill.mdc',   file: '.cursor/rules/invest-skill.mdc' },
  { label: '.github/copilot-instructions.md',  file: '.github/copilot-instructions.md' },
];

// Every prompt file must be referenced in each cross-AI config, so a new skill
// can't be added without wiring it into all platforms (catches the
// stock-screener / catalyst-calendar / full-report omissions we just fixed).
const allPromptNames = fs.existsSync(PROMPTS_DIR)
  ? fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''))
  : [];

// Reuse the framework-count claim pattern: any total (>=10) stated next to
// "framework(s)" must equal the advertised count. Small numbers (section
// sub-counts like "6 frameworks") are treated as sub-totals and ignored.
const frameworkClaimRe = /\b(\d+)\s+(?:[A-Za-z-]+\s+){0,3}frameworks?\b/gi;

CROSS_AI_FILES.forEach(({ label, file }) => {
  const content = readFile(path.join(ROOT, file));
  if (!content) { fail(`${label} — missing`); return; }

  // 1) Completeness — all prompts referenced
  const missingRefs = allPromptNames.filter(name => !content.includes(`prompts/${name}.md`));
  if (missingRefs.length === 0) {
    pass(`${label} — references all ${allPromptNames.length} prompts`);
  } else {
    fail(`${label} — missing prompt reference(s): ${missingRefs.join(', ')}`);
  }

  // 2) Framework-count claims consistent with ADVERTISED
  const badCounts = [];
  for (const m of content.matchAll(frameworkClaimRe)) {
    const n = parseInt(m[1], 10);
    if (n >= 10 && n !== ADVERTISED) badCounts.push(`"${m[0].trim()}" (${n})`);
  }
  if (badCounts.length === 0) {
    pass(`${label} — framework counts consistent (${ADVERTISED})`);
  } else {
    fail(`${label} — stale framework count(s), expected ${ADVERTISED}: ${badCounts.join(', ')}`);
  }
});

// COOKBOOK plugin-list skill counts ("N available skills" / "共 N 個技能")
// must equal the actual number of skill directories.
const SKILL_COUNT_DOCS = [
  { file: 'site/content/COOKBOOK.md',       patterns: [/(\d+)\s+available skills/gi, /(\d+)\s+skills total/gi] },
  { file: 'site/content/COOKBOOK-zh-TW.md', patterns: [/(\d+)\s*個可用技能/g, /共\s*(\d+)\s*個技能/g] },
];
SKILL_COUNT_DOCS.forEach(({ file, patterns }) => {
  const content = readFile(path.join(ROOT, file));
  if (!content) { warn(`${file} — not found for skill-count check`); return; }
  const bad = [];
  patterns.forEach(re => {
    for (const m of content.matchAll(re)) {
      const n = parseInt(m[1], 10);
      if (n !== skillCount) bad.push(`"${m[0].trim()}" (${n})`);
    }
  });
  if (bad.length === 0) {
    pass(`${file} — plugin-list skill count consistent (${skillCount})`);
  } else {
    fail(`${file} — stale skill count(s), expected ${skillCount}: ${bad.join(', ')}`);
  }
});

// ─── Final Summary ───────────────────────────────────────────────────────────

process.stdout.write('\n' + '═'.repeat(60) + '\n');
process.stdout.write(`  TEST RESULTS\n`);
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
  process.stdout.write('\n  🎉 All tests passed!\n\n');
  process.exit(0);
}
