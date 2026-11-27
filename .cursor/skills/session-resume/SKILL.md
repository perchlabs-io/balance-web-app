---
name: session-resume
description: Starts a working session from the last hand-off by reading .cursor/handoff.md, checking it against the actual git, PR and process state, and reporting where things stand before doing any work. Use when the user runs /session-resume or asks to pick up, continue, or resume where the last session left off.
disable-model-invocation: true
---

# Session resume

Pick up from the previous session's hand-off without trusting it blindly: the file may be stale if work happened outside a session.

## Steps

1. **Read `.cursor/handoff.md`.** If it doesn't exist, say so, then build a picture from `CLAUDE.md`, `git log --oneline -10`, `git status --short` and `gh pr list --state open`, and offer to search past chats for more context.

2. **Check it against reality.** Compare each claim in the file with the current state:

   - Branch and HEAD: `git branch --show-current`, `git log --oneline -5`. Note new commits since the recorded sha.
   - Working tree: `git status --short`.
   - PRs: `gh pr view <number> --json state,mergedAt` for each PR the file mentions, plus `gh pr list --state open`.
   - Processes the file lists as running: check the port, e.g. `lsof -ti tcp:<port>`.
   - Age: if the "Updated" time is more than a few days old, say so.

3. **Report before acting.** In a short message to the user:

   - Where things stand, in one or two sentences.
   - Every difference between the hand-off file and reality (e.g. "PR #83 was merged since the hand-off").
   - The next step from the file, adjusted for those differences.
   - Open questions from the file that still need the user's answer.

4. **Wait for the user's go-ahead** before starting the next step if it involves merging, deploying, deleting, or anything the file marks as needing a decision. Otherwise, continue with the next step.

Leave `.cursor/handoff.md` in place; the next `/session-handoff` overwrites it.
