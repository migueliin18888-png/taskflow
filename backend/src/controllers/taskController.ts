import { Response } from "express";
import { Task } from "../models/Task";
import { AuthRequest } from "../types";

// GET /api/tasks?status=Pendiente&priority=Alta
export async function getTasks(req: AuthRequest, res: Response) {
  try {
    const { status, priority } = req.query;
    const filter: Record<string, unknown> = { owner: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener las tareas." });
  }
}

// GET /api/tasks/:id
export async function getTaskById(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }
    return res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener la tarea." });
  }
}

// POST /api/tasks
export async function createTask(req: AuthRequest, res: Response) {
  try {
    const { title, description, dueDate, status, priority } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "El título y la fecha de vencimiento son obligatorios.",
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      priority,
      owner: req.userId,
    });

    return res.status(201).json({ message: "Tarea creada exitosamente.", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear la tarea." });
  }
}

// PUT /api/tasks/:id
export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const { title, description, dueDate, status, priority } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { title, description, dueDate, status, priority },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    return res.status(200).json({ message: "Tarea actualizada.", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la tarea." });
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    return res.status(200).json({ message: "Tarea eliminada correctamente." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar la tarea." });
  }
}
