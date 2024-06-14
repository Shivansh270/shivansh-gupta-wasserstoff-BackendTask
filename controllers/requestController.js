import { addToQueue, processQueue } from "../services/queueService.js";

export const handleRequest = async (req, res, config) => {
  try {
    console.log("Handling request");
    console.log(
      `Received request from ${req.ip}\nHost: ${
        req.hostname
      }\nUser-Agent: ${req.get("User-Agent")}`
    );

    const strategy = req.headers["x-queue-strategy"] || "fifo"; // Determine queue strategy
    addToQueue(req, res, strategy); // Add request to queue
    processQueue(config, strategy); // Process the queue
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message, // Return error message
    });
  }
};
