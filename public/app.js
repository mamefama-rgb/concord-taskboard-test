const list = document.getElementById("list");
const empty = document.getElementById("empty");
const form = document.getElementById("add-form");
const titleInput = document.getElementById("title");
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
      await api(`/api/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify({ done: checkbox.checked }) });
      load();
    });

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = task.title;

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

    li.append(checkbox, title, tag, del);
    list.append(li);
  }
}

async function load() {
  render(await api("/api/tasks"));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await api("/api/tasks", { method: "POST", body: JSON.stringify({ title: titleInput.value }) });
  titleInput.value = "";
  load();
});

load();
