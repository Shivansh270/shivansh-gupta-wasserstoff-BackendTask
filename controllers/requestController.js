import { addToQueue, processQueue } from "../services/queueService.js";

export const handleRequest = async (req, res, config) => {
  try {
    console.log("Handling request");
    console.log(
      `Received request from ${req.ip}\nHost: ${
        req.hostname
      }\nUser-Agent: ${req.get("User-Agent")}`
    );

    const strategy = req.headers["x-queue-strategy"] || "fifo"; // Set queue strategy from request header or default to FIFO
    addToQueue(req, res, strategy);
    processQueue(config, strategy);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
