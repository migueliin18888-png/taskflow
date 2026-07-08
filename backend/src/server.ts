import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Ruta de verificación de estado del servidor
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "TaskFlow API funcionando." });
});

// Manejo de rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${PORT}`);
  });
}

startServer();
