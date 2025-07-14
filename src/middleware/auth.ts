import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../app";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: "Access token required",
        code: "MISSING_TOKEN",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({
        error: "Invalid token - user not found",
        code: "INVALID_TOKEN",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Invalid token",
        code: "INVALID_TOKEN",
      });
      return;
    }

    res.status(500).json({
      error: "Token verification failed",
      code: "TOKEN_VERIFICATION_ERROR",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Authentication required",
        code: "AUTHENTICATION_REQUIRED",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
};
