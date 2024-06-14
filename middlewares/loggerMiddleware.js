// middlewares/loggerMiddleware.js

import {logger} from "../utils/logger.js";

export const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now(); // Capture request start time
  logger.info(
    `Received ${req.method} request from ${req.ip} to ${req.originalUrl}`
  );
  res.on("finish", () => {
    const endTime = Date.now(); // Capture request end time
    const duration = endTime - startTime; // Calculate request duration
    logger.info(`Request to ${req.originalUrl} completed in ${duration}ms`);
  });

  next();
};
