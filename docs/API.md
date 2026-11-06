# API

Base URL: `http://localhost:3000`

| Method | Route | Body | Result |
|--------|-------|------|--------|
| GET | `/api/tasks` | – | list of tasks |
| POST | `/api/tasks` | `{ "title": string }` | `201` + created task |
| PATCH | `/api/tasks/:id` | `{ "title"?: string, "done"?: boolean }` | updated task |
| DELETE | `/api/tasks/:id` | – | `204` |

A task looks like: `{ "id": 1, "title": "Write README", "done": false }`
