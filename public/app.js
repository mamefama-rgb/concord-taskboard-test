const list = document.getElementById("list");
const empty = document.getElementById("empty");
const form = document.getElementById("add-form");
const titleInput = document.getElementById("title");
const prioritySelect = document.getElementById("priority");
const filterPriority = document.getElementById("filter-priority");
const count = document.getElementById("count");

async function api(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.status === 204 ? null : res.json();
}

function render(tasks) {
  list.innerHTML = "";
  empty.hidden = tasks.length > 0;
  count.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
  for (const task of tasks) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", async () => {
      await api(`/api/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: checkbox.checked }),
      });
      load();
    });

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = task.title;

    const priority = task.priority || "normal";
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority priority-${priority}`;
    priorityBadge.textContent = priority;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = task.done ? "done" : "active";

    const del = document.createElement("button");
    del.className = "del";
    del.setAttribute("aria-label", "Delete task");
    del.textContent = "×";
    del.addEventListener("click", async () => {
      await api(`/api/tasks/${task.id}`, { method: "DELETE" });
      load();
    });

    li.append(checkbox, title, priorityBadge, tag, del);
    list.append(li);
  }
}

async function load() {
  const priority = filterPriority ? filterPriority.value : "";
  const query = priority ? `?priority=${encodeURIComponent(priority)}` : "";
  render(await api(`/api/tasks${query}`));
}

if (filterPriority) {
  filterPriority.addEventListener("change", () => {
    load();
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const priority = prioritySelect ? prioritySelect.value : "normal";
  await api("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      title: titleInput.value,
      priority,
    }),
  });
  titleInput.value = "";
  if (prioritySelect) {
    prioritySelect.value = "normal";
  }
  load();
});

load();
