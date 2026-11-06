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
