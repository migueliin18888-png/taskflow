import { Task, TaskStatus, TaskPriority } from "./types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  TaskFilters,
} from "./tasks";
import {
  setFormMessage,
  validateRequired,
  showToast,
  clearFieldErrors,
} from "./ui";

const STATUS_TO_COLUMN_ID: Record<TaskStatus, string> = {
  Pendiente: "col-pendiente",
  "En Progreso": "col-progreso",
  Completada: "col-completada",
};

const STATUS_TO_COUNT_ID: Record<TaskStatus, string> = {
  Pendiente: "countPendiente",
  "En Progreso": "countProgreso",
  Completada: "countCompletada",
};

let currentTasks: Task[] = [];
let activeFilters: TaskFilters = {};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildTaskCard(task: Task): HTMLElement {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.id = task._id;
  card.dataset.priority = task.priority;

  card.innerHTML = `
    <h4>${escapeHtml(task.title)}</h4>
    ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ""}
    <div class="task-meta">
      <span>📅 ${formatDate(task.dueDate)}</span>
      <span class="priority-badge ${task.priority}">${task.priority}</span>
    </div>
  `;

  card.addEventListener("click", () => openTaskModal(task));

  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });

  return card;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderBoard(): void {
  const statuses: TaskStatus[] = ["Pendiente", "En Progreso", "Completada"];

  for (const status of statuses) {
    const column = document.getElementById(STATUS_TO_COLUMN_ID[status]);
    const countBadge = document.getElementById(STATUS_TO_COUNT_ID[status]);
    if (!column || !countBadge) continue;

    const tasksInColumn = currentTasks.filter((t) => t.status === status);
    countBadge.textContent = String(tasksInColumn.length);

    column.innerHTML = "";
    if (tasksInColumn.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-column";
      empty.textContent = "Sin tareas aquí";
      column.appendChild(empty);
      continue;
    }

    tasksInColumn.forEach((task) => column.appendChild(buildTaskCard(task)));
  }
}

async function reloadTasks(): Promise<void> {
  try {
    currentTasks = await fetchTasks(activeFilters);
    renderBoard();
  } catch (error) {
    showToast(
      error instanceof Error ? error.message : "Error al cargar las tareas.",
      "error"
    );
  }
}

function setupDragAndDrop(): void {
  const statuses: TaskStatus[] = ["Pendiente", "En Progreso", "Completada"];

  for (const status of statuses) {
    const column = document.getElementById(STATUS_TO_COLUMN_ID[status]);
    if (!column) continue;

    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });

    column.addEventListener("drop", async (e) => {
      e.preventDefault();
      column.classList.remove("drag-over");

      const draggingCard = document.querySelector<HTMLElement>(
        ".task-card.dragging"
      );
      const taskId = draggingCard?.dataset.id;
      if (!taskId) return;

      const task = currentTasks.find((t) => t._id === taskId);
      if (!task || task.status === status) return;

      try {
        await updateTask(taskId, { status });
        showToast(`Tarea movida a "${status}"`, "success");
        await reloadTasks();
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "No se pudo mover la tarea.",
          "error"
        );
      }
    });
  }
}

function setupFilters(): void {
  const statusSelect = document.getElementById(
    "filterStatus"
  ) as HTMLSelectElement;
  const prioritySelect = document.getElementById(
    "filterPriority"
  ) as HTMLSelectElement;

  const onFilterChange = async () => {
    activeFilters = {
      status: (statusSelect.value || "") as TaskStatus | "",
      priority: (prioritySelect.value || "") as TaskPriority | "",
    };
    await reloadTasks();
  };

  statusSelect.addEventListener("change", onFilterChange);
  prioritySelect.addEventListener("change", onFilterChange);
}

// ==================== Modal de tarea (crear / editar) ====================

function openTaskModal(task?: Task): void {
  const overlay = document.getElementById("taskModalOverlay") as HTMLElement;
  const form = document.getElementById("taskForm") as HTMLFormElement;
  const title = document.getElementById("modalTitle") as HTMLElement;
  const deleteBtn = document.getElementById(
    "deleteTaskBtn"
  ) as HTMLButtonElement;

  form.reset();
  clearFieldErrors(form);
  setFormMessage("taskFormMessage", "", "success");

  const idInput = document.getElementById("taskId") as HTMLInputElement;
  const titleInput = document.getElementById("taskTitle") as HTMLInputElement;
  const descInput = document.getElementById(
    "taskDescription"
  ) as HTMLTextAreaElement;
  const dueDateInput = document.getElementById(
    "taskDueDate"
  ) as HTMLInputElement;
  const priorityInput = document.getElementById(
    "taskPriority"
  ) as HTMLSelectElement;
  const statusInput = document.getElementById(
    "taskStatus"
  ) as HTMLSelectElement;

  if (task) {
    title.textContent = "Editar tarea";
    idInput.value = task._id;
    titleInput.value = task.title;
    descInput.value = task.description;
    dueDateInput.value = task.dueDate.substring(0, 10);
    priorityInput.value = task.priority;
    statusInput.value = task.status;
    deleteBtn.classList.remove("hidden");
  } else {
    title.textContent = "Nueva tarea";
    idInput.value = "";
    deleteBtn.classList.add("hidden");
  }

  overlay.classList.remove("hidden");
}

function closeTaskModal(): void {
  const overlay = document.getElementById("taskModalOverlay") as HTMLElement;
  overlay.classList.add("hidden");
}

function setupTaskModal(): void {
  const overlay = document.getElementById("taskModalOverlay") as HTMLElement;
  const closeBtn = document.getElementById(
    "closeModalBtn"
  ) as HTMLButtonElement;
  const newTaskBtn = document.getElementById(
    "newTaskBtn"
  ) as HTMLButtonElement;
  const form = document.getElementById("taskForm") as HTMLFormElement;
  const deleteBtn = document.getElementById(
    "deleteTaskBtn"
  ) as HTMLButtonElement;

  newTaskBtn.addEventListener("click", () => openTaskModal());
  closeBtn.addEventListener("click", closeTaskModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeTaskModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = validateRequired(form, [
      { id: "taskTitle", label: "El título" },
      { id: "taskDueDate", label: "La fecha de vencimiento" },
    ]);
    if (!isValid) return;

    const id = (document.getElementById("taskId") as HTMLInputElement).value;
    const title = (document.getElementById("taskTitle") as HTMLInputElement)
      .value.trim();
    const description = (
      document.getElementById("taskDescription") as HTMLTextAreaElement
    ).value.trim();
    const dueDate = (document.getElementById("taskDueDate") as HTMLInputElement)
      .value;
    const priority = (
      document.getElementById("taskPriority") as HTMLSelectElement
    ).value as TaskPriority;
    const status = (
      document.getElementById("taskStatus") as HTMLSelectElement
    ).value as TaskStatus;

    try {
      if (id) {
        await updateTask(id, { title, description, dueDate, priority, status });
        showToast("Tarea actualizada correctamente.", "success");
      } else {
        await createTask({ title, description, dueDate, priority, status });
        showToast("Tarea creada correctamente.", "success");
      }
      closeTaskModal();
      await reloadTasks();
    } catch (error) {
      setFormMessage(
        "taskFormMessage",
        error instanceof Error ? error.message : "Error al guardar la tarea.",
        "error"
      );
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const id = (document.getElementById("taskId") as HTMLInputElement).value;
    if (!id) return;

    try {
      await deleteTask(id);
      showToast("Tarea eliminada.", "success");
      closeTaskModal();
      await reloadTasks();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "No se pudo eliminar la tarea.",
        "error"
      );
    }
  });
}

/** Inicializa el tablero completo: filtros, drag&drop, modal y primera carga. */
export async function setupBoard(): Promise<void> {
  setupFilters();
  setupDragAndDrop();
  setupTaskModal();
  await reloadTasks();
}
