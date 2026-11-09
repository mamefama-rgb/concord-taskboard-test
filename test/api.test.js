const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/server");
const store = require("../src/store");

let server;
let base;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

test.after(() => server.close());
test.beforeEach(() => store.reset());

const json = (path, method = "GET", body) =>
  fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

test("creates and lists a task", async () => {
  const created = await json("/api/tasks", "POST", { title: "Write README" });
  assert.strictEqual(created.status, 201);
  const tasks = await (await json("/api/tasks")).json();
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].title, "Write README");
  assert.strictEqual(tasks[0].done, false);
  assert.strictEqual(tasks[0].priority, "normal");
});

test("creates a task with custom priority", async () => {
  const res = await json("/api/tasks", "POST", { title: "Fix bug", priority: "high" });
  assert.strictEqual(res.status, 201);
  const task = await res.json();
  assert.strictEqual(task.priority, "high");
});

test("rejects invalid priority on POST", async () => {
  const res = await json("/api/tasks", "POST", { title: "Invalid", priority: "critical" });
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.ok(data.error && data.error.includes("invalid priority"));
});

test("updates priority via PATCH", async () => {
  const created = await (await json("/api/tasks", "POST", { title: "Feature" })).json();
  assert.strictEqual(created.priority, "normal");

  const res = await json(`/api/tasks/${created.id}`, "PATCH", { priority: "low" });
  assert.strictEqual(res.status, 200);
  const updated = await res.json();
  assert.strictEqual(updated.priority, "low");
});

test("rejects invalid priority on PATCH", async () => {
  const created = await (await json("/api/tasks", "POST", { title: "Feature" })).json();
  const res = await json(`/api/tasks/${created.id}`, "PATCH", { priority: "urgent" });
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.ok(data.error && data.error.includes("invalid priority"));
});

test("filters tasks by priority", async () => {
  await json("/api/tasks", "POST", { title: "Task 1", priority: "low" });
  await json("/api/tasks", "POST", { title: "Task 2", priority: "high" });
  await json("/api/tasks", "POST", { title: "Task 3", priority: "high" });
  await json("/api/tasks", "POST", { title: "Task 4", priority: "normal" });

  const highRes = await json("/api/tasks?priority=high");
  assert.strictEqual(highRes.status, 200);
  const highTasks = await highRes.json();
  assert.strictEqual(highTasks.length, 2);
  assert.ok(highTasks.every((t) => t.priority === "high"));

  const lowRes = await json("/api/tasks?priority=low");
  const lowTasks = await lowRes.json();
  assert.strictEqual(lowTasks.length, 1);
  assert.strictEqual(lowTasks[0].title, "Task 1");

  const normalRes = await json("/api/tasks?priority=normal");
  const normalTasks = await normalRes.json();
  assert.strictEqual(normalTasks.length, 1);
  assert.strictEqual(normalTasks[0].title, "Task 4");

  const allRes = await json("/api/tasks");
  const allTasks = await allRes.json();
  assert.strictEqual(allTasks.length, 4);
});

test("rejects an empty title", async () => {
  const res = await json("/api/tasks", "POST", { title: "   " });
  assert.strictEqual(res.status, 400);
});

test("marks a task as done", async () => {
  const task = await (await json("/api/tasks", "POST", { title: "Ship it" })).json();
  const res = await json(`/api/tasks/${task.id}`, "PATCH", { done: true });
  assert.strictEqual((await res.json()).done, true);
});

test("deletes a task and returns 404 afterwards", async () => {
  const task = await (await json("/api/tasks", "POST", { title: "Temp" })).json();
  assert.strictEqual((await json(`/api/tasks/${task.id}`, "DELETE")).status, 204);
  assert.strictEqual((await json(`/api/tasks/${task.id}`, "DELETE")).status, 404);
});
