import { getNextServer, makeRequestToServer } from "./loadBalancerService.js"; // Ensure the correct import path

let fifoQueue = [];
let priorityQueue = [];
let roundRobinQueue = [];
let roundRobinIndex = 0;

// Add request to the appropriate queue based on the strategy
export const addToQueue = (req, res, strategy) => {
  if (strategy === "priority") {
    const priority = req.body.priority || 0; // Assume priority is sent in the request body
    priorityQueue.push({ req, res, priority });
    priorityQueue.sort((a, b) => b.priority - a.priority);
  } else if (strategy === "round-robin") {
    roundRobinQueue.push({ req, res });
  } else {
    fifoQueue.push({ req, res });
  }
};

const processFifoQueue = async (config) => {
  if (fifoQueue.length === 0) return;

  const { req, res } = fifoQueue.shift();
  const server = getNextServer(req);

  if (!server) {
    res.status(500).json({
      success: false,
      error: "No healthy servers available",
    });
    return;
  }

  await makeRequestToServer(req, res, server);
};

const processPriorityQueue = async (config) => {
  if (priorityQueue.length === 0) return;

  const { req, res } = priorityQueue.shift();
  const server = getNextServer(req);

  if (!server) {
    res.status(500).json({
      success: false,
      error: "No healthy servers available",
    });
    return;
  }

  await makeRequestToServer(req, res, server);
};

const processRoundRobinQueue = async (config) => {
  if (roundRobinQueue.length === 0) return;

  const { req, res } = roundRobinQueue.shift();
  const serverList = config.servers;
  const server = serverList[roundRobinIndex % serverList.length];

  roundRobinIndex++;

  await makeRequestToServer(req, res, server);
};

export const processQueue = async (config, strategy) => {
  if (strategy === "priority") {
    await processPriorityQueue(config);
  } else if (strategy === "round-robin") {
    await processRoundRobinQueue(config);
  } else {
    await processFifoQueue(config);
  }
};