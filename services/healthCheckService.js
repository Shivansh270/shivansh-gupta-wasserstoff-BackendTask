import axios from "axios";
import cron from "node-cron";
import chalk from "chalk";
import { updateServerHealth } from "./loadBalancerService.js";

export const scheduleHealthCheck = (config) => {
  console.log(
    chalk.blue(
      `----- Health check run at every ${config.healthCheckPeriod} seconds -----`
    )
  );
  cron.schedule(`*/${config.healthCheckPeriod} * * * * *`, () =>
    healthCheck(config)
  );
};

const healthCheck = async (config) => {
  try {
    for (const server of config.servers) {
      try {
        const response = await axios.get(
          `${server}${config.healthCheckEndpoint}`
        );
        if (response.status === 200) {
          console.log(chalk.green(`Server ${server} is healthy`));
          updateServerHealth(server, true);
        } else {
          console.log(
            chalk.red(
              `Server ${server} responded with status ${response.status}`
            )
          );
          updateServerHealth(server, false);
        }
      } catch (error) {
        console.log(
          chalk.red(`Server ${server} health check failed: ${error.message}`)
        );
        updateServerHealth(server, false);
      }
    }
  } catch (error) {
    console.error(chalk.red(`Health check error: ${error.message}`));
  }
};
