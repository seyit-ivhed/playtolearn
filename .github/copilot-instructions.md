# Copilot Coding Agent Instructions

When working on a GitHub issue, follow the **issue-resolver** skill defined in `/.agent/skills/issue-resolver/SKILL.md`.

Key points:
- Always create a new branch from `main` before making any changes. Use the pattern `copilot/issue-<issue-number>-<short-description>`.
- Write code following the **frontend-developer** skill in `/.agent/skills/frontend-developer/SKILL.md`.
- After writing code, review it following the **code-reviewer** skill in `/.agent/skills/code-reviewer/SKILL.md`.
- Run existing tests and add new unit tests for any logic you introduce.
- When done, create a **draft** pull request and assign it to `copilot` to trigger an independent secondary code review.

When working on a pull request assigned to you for review, follow the **code-reviewer** skill defined in `/.agent/skills/code-reviewer/SKILL.md`.

Key points:
- Treat the review as fully independent — do not assume the implementation is correct.
- Check correctness, quality, test coverage, and adherence to `/docs/developer-expectations.md`.
- Apply all improvements directly to the branch.
- When done, mark the PR as ready for review and assign it to @seyit-ivhed.
