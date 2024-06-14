import chalk from "chalk";
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "../utils/config.js";
import { startServer } from "../server.js"; // Update import statement

console.log(chalk.green("Welcome to the load balancer CLI"));

const config = loadConfig(); // Load existing configuration or initialize a new one

const configureLoadBalancer = async () => {
  const serverCount = await inquirer.prompt({
    name: "serverCount",
    type: "input",
    message: "Enter number of servers:",
    validate: (input) =>
      /^\d+$/.test(input) || "Please enter a valid numeric value.",
  });

  config.serverCount = serverCount.serverCount;
  config.servers = []; // Reset servers array to avoid duplicate entries

  for (let i = 1; i <= config.serverCount; i++) {
    const server = await inquirer.prompt({
      name: "serverUrl",
      type: "input",
      message: `Enter server URL ${i}`,
    });

    config.servers.push(server.serverUrl);
  }

  const endpoint = await inquirer.prompt({
    name: "endpoint",
    type: "input",
    message:
      'Enter the health check endpoint (e.g., /health). By default, it is set to "/".',
  });

  config.healthCheckEndpoint = endpoint.endpoint || "/"; // Default to '/' if no input is provided

  const period = await inquirer.prompt({
    name: "seconds",
    type: "number",
    message:
      "Enter the time period (in seconds) for checking the server health.",
    validate: (input) =>
      /^\d+$/.test(input) || "Please enter a valid numeric value.",
  });

  config.healthCheckPeriod = period.seconds || 10; // Default to 10 seconds if no input is provided

  saveConfig(config); // Save the updated configuration

  const start = await inquirer.prompt({
    name: "startLB",
    type: "confirm",
    message: "Start LoadBalancer server?",
  });

  if (start.startLB) {
    startServer(); // Start the server
  } else {
    console.log("Closing");
  }
};

configureLoadBalancer();
