# Security Policy

InvestSkill takes security seriously. This document outlines our security practices and how to report vulnerabilities responsibly.

## Security Practices

### What We Protect

- **User data**: None collected. InvestSkill runs locally/client-side only.
- **Code**: Open source, regularly reviewed, well-tested
- **Dependencies**: Minimal (Node.js standard library only)
- **Secrets**: No API keys stored in repository

### What to Know

> ⚠️ **Important**: InvestSkill provides analysis frameworks, not trading signals. Use analysis independently and consult financial advisors before trading.

### No Data Collection

InvestSkill:
- ✅ Runs completely locally (all processing client-side)
- ✅ Stores nothing on remote servers
- ✅ Does not track users
- ✅ Does not send data externally
- ✅ Works offline (except Claude Code API calls)

---

## Reporting a Vulnerability

### Security Issues

If you discover a security vulnerability, **do NOT open a public issue**.

**Instead, email**: security@example.com (or contact repo maintainer privately)

Include:
- Vulnerability type (e.g., injection, credential exposure)
- Location in code (file, line number)
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

**Response timeline**: We aim to respond within 48 hours.

### Privacy Issues

If you have privacy concerns about how InvestSkill processes data:
1. Review [Privacy](#privacy) section
2. Check [Data practices](#what-we-protect)
3. Contact maintainer if concerned

---

## Code Security

### Dependency Policy

- **Minimal dependencies**: We use only Node.js built-ins
- **No npm packages**: Reduces attack surface
- **Version pinning**: All versions locked to specific releases
- **Regular audits**: Code reviewed before each release

### Code Review

All commits:
- Reviewed before merge
- Tested with full test suite
- Validated across all platforms
- Follow security best practices

### Input Validation

InvestSkill:
- Doesn't accept or validate user credentials
- Doesn't process payment information
- Validates file formats (JSON, markdown)
- Escapes output to prevent injection

---

## Supported Versions

| Version | Status | Support |
|---------|--------|---------|
| 1.4.0 | ✅ Current | Full support |
| 1.3.0 | ⚠️ Legacy | Critical fixes only |
| 1.2.0 & earlier | ❌ Unsupported | No support |

**Note**: Update to latest version for security patches and improvements.

---

## Security Checklist for Users

Before using InvestSkill:

- [ ] Running latest version (v1.4.0+)
- [ ] Using trusted Claude Code/Cursor/platform version
- [ ] No credentials or API keys stored in repository
- [ ] Not sharing analysis with untrusted parties
- [ ] Understand: Framework = Analysis tool, not trading advice

---

## Compliance & Standards

### What We Follow

- ✅ MIT License (open source, permissive)
- ✅ OWASP Top 10 (security standards)
- ✅ No GDPR concerns (no user data)
- ✅ No HIPAA (not medical/healthcare)
- ✅ No PCI-DSS (no payment processing)

### What We Don't Do

- ❌ Store personally identifiable information (PII)
- ❌ Process payment information
- ❌ Track user behavior
- ❌ Require authentication
- ❌ Connect to external APIs without user knowledge

---

## Incident Response

If a security issue is discovered:

1. **Report privately** (don't disclose publicly)
2. **Assessment** (we evaluate severity)
3. **Fix** (we develop and test a patch)
4. **Release** (security patch published)
5. **Announce** (security advisory posted)

---

## Responsible Disclosure

We appreciate researchers and security professionals who discover issues.

**Responsible disclosure means:**
- ✅ Report privately first
- ✅ Give us time to patch (typically 90 days)
- ✅ Not sharing vulnerability publicly before patch
- ✅ Not accessing systems/data you're not authorized to access

**What NOT to do:**
- ❌ Public disclosure before patch available
- ❌ Unauthorized access or testing
- ❌ Data extraction or exfiltration
- ❌ Ransom or extortion

---

## FAQ

### Is my data safe?

**Yes.** InvestSkill:
- Doesn't store any user data
- Doesn't send data to external servers
- Runs completely locally
- Doesn't track usage

### Do you sell my data?

**No.** We don't collect data. There's nothing to sell.

### Is the code trustworthy?

**Open source** means the code is publicly auditable:
- Anyone can review the code
- Vulnerabilities are visible
- Community can report issues
- All changes tracked in git history

### What platforms are safe to use?

All InvestSkill platforms are equally safe:
- Claude Code (official plugin)
- Cursor IDE (uses local rules)
- Gemini CLI (local prompts)
- GitHub Copilot (VS Code, JetBrains)
- Universal (copy-paste into any LLM)

### What if I find a vulnerability?

1. Email maintainer privately (don't post publicly)
2. Include: type, location, steps to reproduce
3. Wait for patch before public disclosure
4. We'll issue security advisory and credit you

---

## Security Contact

**Email**: yennanliu (at) gmail (dot) com or open private security discussion

**Response time**: Within 48 hours

**Please do NOT**:
- Open public GitHub issues for vulnerabilities
- Tweet/post vulnerability details publicly
- Attempt unauthorized access

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Security standards
- [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) — Best practices
- [GitHub Security](https://github.blog/2021-12-01-how-github-keeps-your-data-safe/) — Platform security

---

## Changelog

### Security Updates

- **v1.4.0** (2026-02-27): Initial security policy
- Future updates tracked here

---

<div align="center">

### Security is Everyone's Responsibility

Thank you for helping keep InvestSkill safe! 🔒

</div>
