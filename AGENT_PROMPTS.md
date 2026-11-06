# Agent prompts

Use one prompt per agent session. Start both in the root of this repository after running `concord setup`.

## Agent A – backend

```
You are working in a repository coordinated with Concord MCP. Before editing any
file, check who else is active and what they have claimed, and announce what you
are about to work on.

Task (backend): add a `priority` field to tasks.
- Allowed values: "low", "normal", "high". Default: "normal".
- Validate it on POST and PATCH (400 with a clear error message if invalid).
- Support filtering: GET /api/tasks?priority=high
- Add tests in test/api.test.js.
- Update docs/API.md with the new field and the filter.

Another agent is building the front end against this API. If your work overlaps
with theirs, coordinate through Concord instead of overwriting their changes.
When finished, run `npm test` and hand the task off with evidence.
```

## Agent B – frontend

```
You are working in a repository coordinated with Concord MCP. Before editing any
file, check who else is active and what they have claimed, and announce what you
are about to work on.

Task (frontend): support task priorities in the UI.
- Add a priority <select> (low / normal / high) to the add-task form.
- Show a colored badge with the priority on each task.
- Add a filter dropdown above the list that calls GET /api/tasks?priority=<value>.
- Add a short "Frontend usage" section to docs/API.md.

Another agent is implementing the `priority` field in the backend. Agree on the
exact API contract with them through Concord before you rely on it, and do not
edit files they have claimed. When finished, hand the task off with evidence.
```

## Reviewer

```
You are the independent reviewer. Use Concord to read the handoffs and the
review packet from both agents. Then:
1. Run `npm test` and start the app with `npm start`.
2. Check that the UI and the API agree on the priority contract.
3. Check that docs/API.md is consistent and not half-overwritten.
4. Report problems precisely (file + line + expected vs actual).
```
