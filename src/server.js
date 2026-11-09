const path = require("path");
const express = require("express");
const store = require("./store");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const VALID_PRIORITIES = ["low", "normal", "high"];

app.get("/api/tasks", (req, res) => {
  const { priority } = req.query;
  res.json(store.list(priority ? { priority } : undefined));
});

app.post("/api/tasks", (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  let priority = req.body.priority;
  if (priority === undefined) {
    priority = "normal";
  } else if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `invalid priority '${priority}'; must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
  }

  res.status(201).json(store.create({ title, priority }));
});

app.patch("/api/tasks/:id", (req, res) => {
  if (req.body.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({
        error: `invalid priority '${req.body.priority}'; must be one of: ${VALID_PRIORITIES.join(", ")}`,
      });
    }
  }

  const task = store.update(Number(req.params.id), req.body);
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const ok = store.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "task not found" });
  res.status(204).end();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Task board running on http://localhost:${port}`));
}

module.exports = app;
