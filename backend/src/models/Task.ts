import { Schema, model, Document, Types } from "mongoose";
import { TaskStatus, TaskPriority } from "../types";

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [120, "El título no puede exceder 120 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
    },
    dueDate: {
      type: Date,
      required: [true, "La fecha de vencimiento es obligatoria"],
    },
    status: {
      type: String,
      enum: ["Pendiente", "En Progreso", "Completada"],
      default: "Pendiente",
    },
    priority: {
      type: String,
      enum: ["Baja", "Media", "Alta"],
      default: "Media",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Índices para acelerar el filtrado por estado/prioridad por usuario
taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, priority: 1 });

export const Task = model<ITask>("Task", taskSchema);
