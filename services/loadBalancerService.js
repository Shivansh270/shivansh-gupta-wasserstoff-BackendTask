// loadBalancerService.js
import chalk from "chalk";
import axios from "axios";

let healthyServers = []; // Array to store healthy servers

// Update the health status of a server
export const updateServerHealth = (server, isHealthy) => {
  if (isHealthy && !healthyServers.includes(server)) {
    healthyServers.push(server); // Add server to healthy servers if it is healthy and not already in the list
    console.log(chalk.green(`Server ${server} added to healthy servers`));
  } else if (!isHealthy) {
    healthyServers = healthyServers.filter((s) => s !== server); // Remove server from healthy servers if it is not healthy
    console.log(chalk.yellow(`Server ${server} removed from healthy servers`));
  }
};

// Select the next server to handle the request based on the request type
export const getNextServer = (req) => {
  if (healthyServers.length === 0) {
    console.log(chalk.red("No healthy servers available")); // Log if no healthy servers are available
    return null;
  }

  const { method, originalUrl } = req;
  let server;

  // Route requests based on method and URL
  if (method === "GET" && originalUrl.includes("/api/rest")) {
    server = getRandomServer(); // Route GET requests with /api/rest to a random server
  } else if (method === "POST" && req.body && req.body.payloadSize > 1000) {
    server = getRandomServer(); // Route POST requests with payload size > 1000 to a random server
  } else {
    server = getRandomServer(); // Default to random server for other requests
  }

  console.log(chalk.blue(`Selected server: ${server}`)); // Log selected server
  return server;
};

// Get a random server from the list of healthy servers
const getRandomServer = () => {
  return healthyServers[Math.floor(Math.random() * healthyServers.length)];
};

// Make a request to the selected server
export const makeRequestToServer = async (req, res, server) => {
  try {
    const { data } = await axios({
      method: req.method,
      url: `${server}${req.originalUrl}`, // Construct URL using the server and original URL
      data: req.body,
      headers: req.headers,
    });
    res.status(200).json({
      success: true,
      data, // Return successful response with data from the server
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message, // Return error message if the request fails
    });
  }
};
