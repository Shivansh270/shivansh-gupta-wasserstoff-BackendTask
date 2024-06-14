import express from "express";
import { handleRequest } from "./controllers/requestController.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { scheduleHealthCheck } from "./services/healthCheckService.js";
import { loadConfig } from "./utils/config.js";

// Create an Express app
const app = express();
const PORT = 4000;

// Load configuration
const config = loadConfig();

app.use(express.json()); // Middleware to parse JSON bodies

// Logger middleware
app.use(loggerMiddleware);

// Handle all incoming requests
app.all("*", (req, res) => handleRequest(req, res, config));

// POST endpoint handler for /api/data
app.post("/api/data", (req, res) => {
  try {
    // Your logic for handling POST requests to /api/data
    console.log("Received POST request at /api/data");
    res.json({ message: "Received POST request at /api/data" });
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to start the server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Load Balancer is running on port: ${PORT}`);
    scheduleHealthCheck(config); // Schedule health checks
  });
};

// Export the startServer function
export { startServer };
