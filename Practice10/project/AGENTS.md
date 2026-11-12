# Agent playbook — Smart Campus Room Availability Checker

## Purpose and permitted scope
- Maintain a **single fictional room** and its read-only availability checker.
- Preserve acceptance criteria AC1–AC6: reject invalid/past time windows; max 120-minute duration; reject blocked room and overlapping bookings while allowing endpoint-touching; never mutate booking fixtures; show clear feedback with usable desktop/mobile layout.
- Preserve the fixed demo current time (08:00). All booking times are minutes after midnight on the same day.
- Keep the UI, booking rules, and fixture data in their existing modules. Prefer small, reviewable changes over architectural rewrites.

## Safe workflow
1. Inspect the relevant code and tests before proposing changes.
2. Describe the smallest patch and its risks, then request human approval before applying changes outside the agreed scope.
3. Keep changes isolated; summarize every changed file and explain why.
4. Run and report actual outputs for `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` when the environment supports them; label any unrun checks `NOT RUN`.
5. Review desktop and mobile layout manually where a browser is available. Include before/after evidence for behavior changes.
6. Obtain human approval before merging, deploying, installing dependencies, or initiating background work.

## Forbidden actions
- Do not add authentication, a backend, database, external APIs, or real booking creation.
- Do not access real personal information, credentials, secrets, or production services.
- Do not modify the fictional booking fixtures, acceptance criteria, or existing test expectations without explicit approval.
- Do not remove or weaken tests to make a build green.
- Do not run destructive commands or deploy, merge, or publish without explicit approval.
- Do not claim unexecuted tests passed or assume this file was automatically loaded: read it explicitly.

## Reviewer checklist
- Scope remains exactly one fictional room and no persistent booking side effects.
- AC1–AC6 continue to hold; new regression tests cover affected behavior.
- Diff is minimal; no unexpected dependency, network, or configuration changes.
- Test command output and remaining uncertainties are recorded; a human approves changes before release.
