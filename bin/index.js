import inquirer from "inquirer"; // For interactive prompts
import { loadConfig, saveConfig } from "../utils/config.js"; 
import { startServer } from "../server.js";

console.log(chalk.green("Welcome to the load balancer CLI")); // Welcome message

const config = loadConfig(); // Load or initialize configuration

const configureLoadBalancer = async () => {
  // Prompt for number of servers
  const serverCount = await inquirer.prompt({
    name: "serverCount",
    type: "input",
    message: "Enter number of servers:",
    validate: (input) =>
      /^\d+$/.test(input) || "Please enter a valid numeric value.",
  });

  config.serverCount = serverCount.serverCount;
  config.servers = []; // Reset servers array

  // Collect server URLs
  for (let i = 1; i <= config.serverCount; i++) {
    const server = await inquirer.prompt({
      name: "serverUrl",
      type: "input",
      message: `Enter server URL ${i}`,
    });
    config.servers.push(server.serverUrl);
  }

  // Prompt for health check endpoint, default to "/"
  const endpoint = await inquirer.prompt({
    name: "endpoint",
    type: "input",
    message:
      'Enter the health check endpoint (e.g., /health). By default, it is set to "/".',
  });

  config.healthCheckEndpoint = endpoint.endpoint || "/";

  // Prompt for health check period, default to 10 seconds
  const period = await inquirer.prompt({
    name: "seconds",
    type: "number",
    message:
      "Enter the time period (in seconds) for checking the server health.",
    validate: (input) =>
      /^\d+$/.test(input) || "Please enter a valid numeric value.",
  });

  config.healthCheckPeriod = period.seconds || 10;

  saveConfig(config); // Save configuration

  // Prompt to start load balancer server
  const start = await inquirer.prompt({
    name: "startLB",
    type: "confirm",
    message: "Start LoadBalancer server?",
  });

  if (start.startLB) {
    startServer(); // Start the server
  } else {
    console.log("Closing"); // Close the CLI
  }
};

configureLoadBalancer(); // Run the configuration function
