import fs from "fs";
import path from "path";

const configPath = path.resolve("config.json");

export const loadConfig = () => {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  }
  return {
    serverCount: 0,
    servers: [],
    healthCheckEndpoint: "/",
    healthCheckPeriod: 10,
  };
};

export const saveConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
};
