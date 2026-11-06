const path = require("path");
const express = require("express");
const store = require("./store");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/tasks", (req, res) => {
  res.json(store.list());
});

app.post("/api/tasks", (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  res.status(201).json(store.create({ title }));
});

app.patch("/api/tasks/:id", (req, res) => {
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
