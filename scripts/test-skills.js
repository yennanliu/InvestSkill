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
  ['name', 'description', 'version', 'author', 'skills'].forEach(field => {
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

const registeredSkills = (pluginJson && pluginJson.skills) ? pluginJson.skills : [];
const actualSkillDirs = fs.existsSync(SKILLS_DIR)
  ? fs.readdirSync(SKILLS_DIR).filter(d =>
      fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
    )
  : [];

// Every registered skill must have a directory
registeredSkills.forEach(skill => {
  if (actualSkillDirs.includes(skill)) {
    pass(`Registered skill "${skill}" has directory`);
  } else {
    fail(`Registered skill "${skill}" has NO directory in skills/`);
  }
});

// Every directory must be registered
actualSkillDirs.forEach(dir => {
  if (registeredSkills.includes(dir)) {
    pass(`Directory "${dir}" is registered in plugin.json`);
  } else {
    fail(`Directory "${dir}" exists but is NOT registered in plugin.json skills[]`);
  }
});

pass(`Total skills: ${registeredSkills.length} registered, ${actualSkillDirs.length} directories`);

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
    warn(`${skill}/SKILL.md — low word count (${words} words, min ${MIN_SKILL_WORDS})`);
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

const cookbookFiles = ['COOKBOOK.md', 'COOKBOOK-zh-TW.md'];
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
