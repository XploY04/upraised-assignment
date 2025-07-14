import { Request, Response, NextFunction } from "express";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: "Endpoint not found",
    code: "NOT_FOUND",
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      auth: "/api/auth",
      gadgets: "/api/gadgets",
      health: "/health",
    },
  });
};
