# Security Policy 🛡️

The maintainers of **The Known World Navigator** take security and data integrity seriously. We appreciate the responsible disclosure of any potential vulnerabilities.

---

## Supported Versions

Only the current version deployed on the `main` branch receives active security updates and patches.

| Version | Supported          |
| :---    | :---:              |
| `main`  | :white_check_mark: |
| Older   | :x:                |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub issues.**

If you discover a potential security vulnerability (e.g., Cross-Site Scripting, dependency supply-chain risks, prototype pollution, sensitive data exposure), please report it privately through one of the following channels:

1. **GitHub Private Vulnerability Reporting (Preferred):**
   * Navigate to the **[Security tab](https://github.com/garcejan/got-map-explorer/security)** on GitHub.
   * Click **Advisories** -> **Report a vulnerability**.
   * Provide full details and proof of concept.

2. **Direct Contact:**
   * Reach out directly to the maintainer via GitHub profile contact: [@garcejan](https://github.com/garcejan).

### What to Include in Your Report
To help us triage and resolve the issue quickly, please provide:
* A description of the vulnerability and its potential impact.
* Step-by-step instructions or minimal script to reproduce the behavior.
* Proposed remediation or patch if available.

### What You Can Expect
* **Initial response:** Within 48 hours acknowledging receipt.
* **Triage & validation:** Assessment of severity and impact.
* **Remediation:** A patch will be tested, committed, and deployed promptly.
* **Attribution:** Credit in the release notes (unless you prefer anonymity).

---

## Security Best Practices for Contributors
* Never commit secrets, personal access tokens, or `.env` files to git.
* Keep dependencies up to date and verify npm audit alerts.
* Do not introduce untrusted `dangerouslySetInnerHTML` or unsanitized DOM manipulations.
