import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("La variable de entorno MONGODB_URI no está definida.");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
}
