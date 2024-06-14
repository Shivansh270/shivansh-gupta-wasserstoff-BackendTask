import { getNextServer, makeRequestToServer } from "./loadBalancerService.js";

let fifoQueue = []; // FIFO queue for requests
let priorityQueue = []; // Priority queue for requests
let roundRobinQueue = []; // Round-robin queue for requests
let roundRobinIndex = 0; // Index for round-robin server selection

// Add request to the appropriate queue based on the strategy
export const addToQueue = (req, res, strategy) => {
  if (strategy === "priority") {
    const priority = req.body.priority || 0; // Assume priority is sent in the request body
    priorityQueue.push({ req, res, priority });
    priorityQueue.sort((a, b) => b.priority - a.priority); // Sort by priority
  } else if (strategy === "round-robin") {
    roundRobinQueue.push({ req, res });
  } else {
    fifoQueue.push({ req, res }); // Default to FIFO strategy
  }
};

// Process the FIFO queue
const processFifoQueue = async (config) => {
  if (fifoQueue.length === 0) return; // Exit if the queue is empty

  const { req, res } = fifoQueue.shift(); // Get the first request in the queue
  const server = getNextServer(req); // Get the next healthy server

  if (!server) {
    res.status(500).json({
      success: false,
      error: "No healthy servers available",
    });
    return;
  }

  await makeRequestToServer(req, res, server); // Forward the request to the selected server
};

// Process the priority queue
const processPriorityQueue = async (config) => {
  if (priorityQueue.length === 0) return; // Exit if the queue is empty

  const { req, res } = priorityQueue.shift(); // Get the highest priority request
  const server = getNextServer(req); // Get the next healthy server

  if (!server) {
    res.status(500).json({
      success: false,
      error: "No healthy servers available",
    });
    return;
  }

  await makeRequestToServer(req, res, server); // Forward the request to the selected server
};

// Process the round-robin queue
const processRoundRobinQueue = async (config) => {
  if (roundRobinQueue.length === 0) return; // Exit if the queue is empty

  const { req, res } = roundRobinQueue.shift(); // Get the first request in the queue
  const serverList = config.servers;
  const server = serverList[roundRobinIndex % serverList.length]; // Select server in round-robin fashion

  roundRobinIndex++; // Increment the round-robin index

  await makeRequestToServer(req, res, server); // Forward the request to the selected server
};

// Process the queue based on the strategy
export const processQueue = async (config, strategy) => {
  if (strategy === "priority") {
    await processPriorityQueue(config); // Process priority queue
  } else if (strategy === "round-robin") {
    await processRoundRobinQueue(config); // Process round-robin queue
  } else {
    await processFifoQueue(config); // Process FIFO queue
  }
};
