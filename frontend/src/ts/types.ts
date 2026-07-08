export type TaskStatus = "Pendiente" | "En Progreso" | "Completada";
export type TaskPriority = "Baja" | "Media" | "Alta";

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  message: string;
  task: Task;
}

export interface ApiError {
  message: string;
}
