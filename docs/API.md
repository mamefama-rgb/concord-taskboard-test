# API

Base URL: `http://localhost:3000`

| Method | Route | Body | Result |
|--------|-------|------|--------|
| GET | `/api/tasks` or `/api/tasks?priority=<value>` | – | list of tasks (optionally filtered by priority) |
| POST | `/api/tasks` | `{ "title": string, "priority"?: string }` | `201` + created task |
| PATCH | `/api/tasks/:id` | `{ "title"?: string, "done"?: boolean, "priority"?: string }` | updated task |
| DELETE | `/api/tasks/:id` | – | `204` |

A task looks like: `{ "id": 1, "title": "Write README", "done": false, "priority": "normal" }`

### Priority
- Allowed values: `"low"`, `"normal"`, `"high"`.
- Default: `"normal"`.
- Validation: POST and PATCH reject invalid priority values with `400` and an error message.
- Filtering: `GET /api/tasks?priority=high` (or `low`, `normal`) filters tasks by priority.

## Frontend usage
- **Adding tasks with priority**: The add-task form includes a priority dropdown (`low`, `normal`, `high`). The default selection is `normal`. Submitting the form sends `{ title, priority }` via `POST /api/tasks`.
- **Priority badges**: Each task item displays a colored badge showing its assigned priority (`low`, `normal`, `high`).
- **Filtering by priority**: A filter dropdown above the task list allows filtering tasks by priority. Selecting a priority option triggers `GET /api/tasks?priority=<value>`. Selecting "all" requests `GET /api/tasks` without query parameters to display all tasks.
