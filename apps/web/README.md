# QueryEditor - Website & Releases Repository

**QueryEditor** is a highly optimized, local-first SQL client designed exclusively for writing, editing, and executing queries with a code-centric, distraction-free workflow.

> **Note:** The core desktop application of QueryEditor is closed-source. This public repository hosts the source code for the official landing page and serves as the primary distribution channel for application updates via [GitHub Releases](https://github.com/queryeditor/website/releases).

## 🚀 Overview

QueryEditor shifts the paradigm of traditional database clients by utilizing a **file-system-driven workspace**. Every connection creates a local directory where all queries are stored securely as native `.sql` files.

Packed with modern developer tools, it combines the robust capabilities of **Monaco Editor** with a deeply optimized data grid, allowing developers to handle heavy query results seamlessly.

### Key Features

- **Local-First Architecture:** Completely decentralized architecture. No telemetry, no cloud backups, and no enforced accounts. Total privacy.
- **File-System Workspaces:** Queries are managed like real code—inside folders as `.sql` files.
- **Advanced AI Assistance:** Bring Your Own Key (BYOK) for OpenAI, Google Gemini, or Anthropic. AI operates in strict **read-only mode**, requiring explicit per-action user consent to read schema context.
- **Safe Modes:** Protect production environments with built-in rules like _read-only_, _safe-mode_, _confirm_, and _silent_ execution.
- **Proactive Security:** Passwords and API tokens are proactively encrypted locally on the user's disk.

## 🌐 Official Links

- **Website / App Download:** [https://queryeditor.com] _(Update domain if needed)_
- **Developer Portfolio:** [https://daustinn.com](https://daustinn.com)
- **X (Twitter):** [@queryeditor](https://x.com/queryeditor)
- **GitHub Organization:** [@queryeditor](https://github.com/queryeditor)

## ⚖️ Legal & Privacy

Because QueryEditor values security and privacy, we maintain comprehensive policies detailing our strict separation from your sensitive data.

- [Privacy Policy](src/pages/legal/privacy-policy/content.mdx)
- [Terms and Conditions](src/pages/legal/term-and-conditions/content.mdx)

## 🏗️ About This Repository (Website)

This repository contains the Astro-based frontend for the QueryEditor landing page.

### Commands

All commands are run from the root of the project:

| Command       | Action                                      |
| :------------ | :------------------------------------------ |
| `bun install` | Installs dependencies                       |
| `bun dev`     | Starts local dev server at `localhost:4321` |
| `bun build`   | Build your production site to `./dist/`     |

---

_Built with passion by [David Bendezú](https://daustinn.com) from Ayacucho, Peru._
