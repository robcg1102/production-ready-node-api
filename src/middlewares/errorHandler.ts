import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    err,
    method: req.method,
    url: req.url,
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};