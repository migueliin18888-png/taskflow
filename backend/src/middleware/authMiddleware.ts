import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";

/**
 * Middleware que protege rutas: exige un token JWT válido en el header
 * Authorization: Bearer <token>. Si no es válido, corta la petición con 401.
 */
export function protect(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No autorizado. Debes iniciar sesión para continuar.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado. Vuelve a iniciar sesión.",
    });
  }
}
