import winston from "winston";

let healthyServers = [];
let deadServers = [];

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, service }) => {
      return `${timestamp} | ${level.toUpperCase()} | ${service} | ${message}`;
    })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const updateServerHealth = (server, isHealthy) => {
  if (isHealthy && !healthyServers.includes(server)) {
    healthyServers.push(server);
    logger.info(
      `Server ${server} added to healthy servers. Total running servers: ${healthyServers.length}`
    );
  } else if (!isHealthy) {
    healthyServers = healthyServers.filter((s) => s !== server);
    deadServers.push(server);
    logger.warn(
      `Server ${server} removed from healthy servers. Total running servers: ${healthyServers.length}. Total dead servers: ${deadServers.length}`
    );
  }
};

export { logger, updateServerHealth };
