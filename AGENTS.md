# Project agent guidance

## Route each request

Classify the request, then load only the matching project workflow:

- **Architecture or design** — use `.agents/skills/architecture-design/SKILL.md` when choosing module boundaries, APIs, architecture, or recording a consequential decision.
- **Implementation or refactoring** — use `.agents/skills/implementation-refactoring/SKILL.md` for code changes, bug fixes, and refactors.
- **Dependencies, security, or delivery** — use `.agents/skills/dependencies-security-delivery/SKILL.md` when changing dependencies, touching security-sensitive surfaces, or preparing a delivery.
- **UI or visual design** — use `.agents/skills/swiss-design/SKILL.md` for visual styling, layout, and design-system work; do not apply it to routine non-visual engineering.

Combine workflows only when the request crosses their boundaries. For example, an implementation that changes a trust boundary uses both the implementation and security workflows.

The global Matt Pocock skills plugin remains the shared source for its skills. Use relevant skills by name, such as `codebase-design`, `implement`, `diagnosing-bugs`, `code-review`, `tdd`, and `pr`; do not copy their contents into this repository.

## Project-wide decisions

- Scale process to risk and task size. Ask the user when uncertainty materially affects behavior, scope, architecture, safety, or external effects. Otherwise state assumptions and proceed.
- Prefer direct work. Delegate only substantial independent work or when the user asks.
- Seek user approval before consequential external or hard-to-reverse actions. Do not commit or push unless explicitly requested.
- Leave completed changes in the worktree and report changed files, verification results, known caveats, and manual next steps.
