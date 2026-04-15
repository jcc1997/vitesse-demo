import "./styles.css";

type Task = {
  id: number;
  text: string;
  done: boolean;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
  throw new Error("App root not found");
}

const root = app;

let counter = 1;
let tasks: Task[] = [
  { id: 1, text: "Open the deployed demo", done: true },
  { id: 2, text: "Add a new task through the UI", done: false }
];

function getBuildMetadata(): { requirement: string; commit: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    requirement: params.get("requirement") ?? "manual-run",
    commit: params.get("commit") ?? "unknown"
  };
}

function addTask(text: string): void {
  tasks = [
    { id: Date.now(), text, done: false },
    ...tasks
  ];
  render();
}

function toggleTask(id: number): void {
  tasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    return {
      ...task,
      done: !task.done
    };
  });
  render();
}

function clearDone(): void {
  tasks = tasks.filter((task) => !task.done);
  render();
}

function render(): void {
  const metadata = getBuildMetadata();
  const completedCount = tasks.filter((task) => task.done).length;

  root.innerHTML = `
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">solo-lab external demo</p>
        <h1 data-testid="page-title">Deployment Validation Console</h1>
        <p class="lede">
          This tiny app is published by GitHub Actions and exercised remotely by Playwright.
        </p>
        <div class="meta-grid">
          <article class="meta-card">
            <span class="meta-label">Requirement</span>
            <strong data-testid="requirement-id">${metadata.requirement}</strong>
          </article>
          <article class="meta-card">
            <span class="meta-label">Commit</span>
            <strong data-testid="commit-sha">${metadata.commit}</strong>
          </article>
        </div>
      </section>

      <section class="panel panel-accent">
        <div class="panel-header">
          <h2>Counter</h2>
          <p>Used by the smoke test to verify live interaction.</p>
        </div>
        <div class="counter-row">
          <button data-testid="decrement" class="ghost">-</button>
          <output data-testid="counter-value">${counter}</output>
          <button data-testid="increment" class="primary">+</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Task Board</h2>
          <p>Add, complete and prune tasks from the deployed page.</p>
        </div>
        <form data-testid="task-form" class="task-form">
          <input
            data-testid="task-input"
            name="task"
            type="text"
            placeholder="Ship deployment callback"
            autocomplete="off"
          />
          <button data-testid="task-submit" type="submit" class="primary">Add task</button>
        </form>
        <button data-testid="clear-done" class="ghost wide">Clear completed</button>
        <div class="summary">
          <span data-testid="task-total">${tasks.length}</span>
          <span>tasks</span>
          <span class="divider">•</span>
          <span data-testid="task-completed">${completedCount}</span>
          <span>done</span>
        </div>
        <ul data-testid="task-list" class="task-list">
          ${tasks
            .map((task) => {
              return `
                <li class="task-item ${task.done ? "done" : ""}">
                  <label>
                    <input
                      data-testid="task-toggle-${task.id}"
                      type="checkbox"
                      ${task.done ? "checked" : ""}
                    />
                    <span>${task.text}</span>
                  </label>
                </li>
              `;
            })
            .join("")}
        </ul>
      </section>
    </main>
  `;

  const incrementButton = root.querySelector<HTMLButtonElement>('[data-testid="increment"]');
  const decrementButton = root.querySelector<HTMLButtonElement>('[data-testid="decrement"]');
  const form = root.querySelector<HTMLFormElement>('[data-testid="task-form"]');
  const input = root.querySelector<HTMLInputElement>('[data-testid="task-input"]');
  const clearDoneButton = root.querySelector<HTMLButtonElement>('[data-testid="clear-done"]');

  incrementButton?.addEventListener("click", () => {
    counter += 1;
    render();
  });

  decrementButton?.addEventListener("click", () => {
    counter -= 1;
    render();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = input?.value.trim() ?? "";
    if (value.length === 0) {
      return;
    }

    addTask(value);
  });

  clearDoneButton?.addEventListener("click", () => {
    clearDone();
  });

  tasks.forEach((task) => {
    const checkbox = root.querySelector<HTMLInputElement>(`[data-testid="task-toggle-${task.id}"]`);
    checkbox?.addEventListener("change", () => {
      toggleTask(task.id);
    });
  });
}

render();
