---
name: session-handoff
description: Ends a working session by recording verified current state in .cursor/handoff.md and moving durable lessons into CLAUDE.md, so the next chat can pick up where this one stopped. Use when the user runs /session-handoff or asks to wrap up, hand off, or save session state.
disable-model-invocation: true
---

# Session hand-off

Write `.cursor/handoff.md` so a new chat, with none of this conversation's context, can continue the work. The file is gitignored: it's personal, local, short-lived state. Lasting knowledge belongs in `CLAUDE.md`.

## Steps

1. **Collect the real state.** Don't rely on memory of the conversation; check:

   - `git branch --show-current`, `git status --short`, `git log --oneline -5`
   - Unpushed commits: `git log --oneline @{u}..` (if the branch has an upstream)
   - Open PRs: `gh pr list --state open`
   - Processes this session started (dev or preview servers, background tasks). Stop them unless the user asked to keep them running, then record which are still running and on which port.

2. **Promote lasting knowledge to `CLAUDE.md`.** Anything that stays true beyond the next session goes there, not in the hand-off file: new backlog items, conventions, testing gotchas, architecture facts. Remove backlog items that were finished. Skip this step if nothing qualifies.

3. **Write `.cursor/handoff.md`**, overwriting any previous version, using the template below.

   - Keep it under about 60 lines. Write complete sentences; the reader wasn't here.
   - Record facts you verified in step 1, not plans you assume happened.
   - Never include secret values (tokens, keys, `.env` contents).

4. **Report to the user** in a few sentences: what the hand-off file says the next step is, anything still running, anything uncommitted, and what you changed in `CLAUDE.md`. Remind them that `CLAUDE.md` edits need committing. Don't commit `.cursor/handoff.md`.

## Template

```markdown
# Session hand-off

Updated: <YYYY-MM-DD HH:MM, local time>
Branch: <branch> at <short sha>

## Goal

<One or two sentences: what this line of work is trying to achieve.>

## Done this session

- <Finished items, with PR links and merge commits where relevant.>

## State right now

- Uncommitted: <files, or "nothing">
- Unpushed commits: <list, or "none">
- Open PRs: <links and status, or "none">
- Running: <processes and ports, or "nothing">

## Next steps

1. <The very next concrete action.>
2. <Following actions.>

## Open questions and decisions

- <Anything waiting on the user, with the options discussed.>

## Watch out for

- <Short-lived gotchas: a flaky check, a half-finished experiment, a temp folder to delete.>
```
