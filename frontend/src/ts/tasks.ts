import { apiRequest } from "./api";
import {
  Task,
  TasksResponse,
  TaskResponse,
  TaskStatus,
  TaskPriority,
} from "./types";

export interface TaskFilters {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
}

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export async function fetchTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);

  const query = params.toString() ? `?${params.toString()}` : "";
  const { tasks } = await apiRequest<TasksResponse>(`/tasks${query}`);
  return tasks;
}

export async function createTask(input: TaskInput): Promise<Task> {
  const { task } = await apiRequest<TaskResponse>("/tasks", {
    method: "POST",
    body: input,
  });
  return task;
}

export async function updateTask(
  id: string,
  input: Partial<TaskInput>
): Promise<Task> {
  const { task } = await apiRequest<TaskResponse>(`/tasks/${id}`, {
    method: "PUT",
    body: input,
  });
  return task;
}

export async function deleteTask(id: string): Promise<void> {
  await apiRequest(`/tasks/${id}`, { method: "DELETE" });
}
