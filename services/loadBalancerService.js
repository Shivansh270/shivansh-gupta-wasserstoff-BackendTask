// loadBalancerService.js
import chalk from "chalk";
import axios from "axios";

let healthyServers = [];

export const updateServerHealth = (server, isHealthy) => {
  if (isHealthy && !healthyServers.includes(server)) {
    healthyServers.push(server);
    console.log(chalk.green(`Server ${server} added to healthy servers`));
  } else if (!isHealthy) {
    healthyServers = healthyServers.filter((s) => s !== server);
    console.log(chalk.yellow(`Server ${server} removed from healthy servers`));
  }
};

export const getNextServer = (req) => {
  if (healthyServers.length === 0) {
    console.log(chalk.red("No healthy servers available"));
    return null;
  }

  const { method, originalUrl } = req;
  let server;
  if (method === "GET" && originalUrl.includes("/api/rest")) {
    // Route GET requests with /api/rest to a random server
    server = getRandomServer();
  } else if (method === "POST" && req.body && req.body.payloadSize > 1000) {
    // Route POST requests with payload size > 1000 to a random server
    server = getRandomServer();
  } else {
    // Default to random server for other requests
    server = getRandomServer();
  }

  console.log(chalk.blue(`Selected server: ${server}`));
  return server;
};

const getRandomServer = () => {
  return healthyServers[Math.floor(Math.random() * healthyServers.length)];
};

export const makeRequestToServer = async (req, res, server) => {
  try {
    const { data } = await axios({
      method: req.method,
      url: `${server}${req.originalUrl}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
