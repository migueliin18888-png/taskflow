import { Request } from "express";

export type TaskStatus = "Pendiente" | "En Progreso" | "Completada";
export type TaskPriority = "Baja" | "Media" | "Alta";

export interface JwtPayload {
  userId: string;
}

// Extiende Request de Express para incluir el usuario autenticado
export interface AuthRequest extends Request {
  userId?: string;
}
