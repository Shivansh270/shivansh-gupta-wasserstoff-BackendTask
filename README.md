<div align="center">
<h1><b> Intelligent Load Balancer</b></h1>
<p>This project implements a dynamic and configurable load balancer using Node.js. It efficiently distributes incoming network or application traffic across multiple servers to ensure optimal resource utilization, minimize response times, and avoid overload on any single server.</p>
</div>

## Table of Contents
- [Overview](#overview)
  - [Load Balancing Strategy](#load-balancing-strategy)
    - [Operational Mechanism](#operational-mechanism)
    - [Request Handling](#request-handling)
- [Visual Representation of Request Distribution](#visual-representation-of-request-distribution)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technological Stack](#technological-stack)
- [Installation Instructions](#installation-instructions)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Authors and Acknowledgment](#authors-and-acknowledgment)
- [Versioning](#versioning)
- [Contact Information](#contact-information)

## Overview
This project is a Node.js application designed to distribute incoming network traffic across multiple servers, thereby increasing the availability and reliability of applications. It dynamically assesses the health of servers, managing traffic to ensure high availability and optimal performance across the server pool.

### Load Balancing Strategy

The load balancer supports multiple strategies for distributing requests:

- **FIFO (First In, First Out):** Requests are processed in the order they are received.
- **Priority Queue:** Requests are prioritized based on a priority value in the request body.
- **Round-Robin:** Requests are distributed evenly among healthy servers in a circular manner.

#### Operational Mechanism:

- *Server Weighting*: Each server is assigned a specific weight that reflects its handling capacity.
- *Index Management*: The load balancer maintains an index to track the current server in the rotation.
- *Request Distribution*: Upon receiving a request, the load balancer selects the next server based on the predefined weights in a round-robin sequence.
- *Index Update*: After each request is allocated, the server index is updated, preparing the system for the next request.

#### Request Handling:

The load balancer processes incoming requests as follows:

- **Request Arrival:**
   - Incoming requests are received by the load balancer server.

- **Load Balancing Decision:**
   - The load balancer determines the appropriate server based on the configured load balancing strategy.

- **Server Selection:**
   - The request is forwarded to the selected server for processing.

- **Response Return:**
   - The server processes the request and sends back the response to the client through the load balancer.

## Visual Representation of Request Distribution

Below is a diagram illustrating how the load balancer implements different strategies to distribute requests among servers:

graph TD;
  subgraph Servers
    Server1[Server 1]
    Server2[Server 2]
    Server3[Server 3]
    Server4[Server 4]
  end
  LoadBalancer[Load Balancer] -->|FIFO (First In, First Out)| Server1
  LoadBalancer -->|Priority Queue| Server2
  LoadBalancer -->|Round-Robin| Server3
  LoadBalancer -->|Custom Strategy| Server4


## Project Structure

```
load-balancer/
│
├── bin/
│ └── index.js # Entry point script located in bin
│
├── controllers/
│ └── requestController.js # Handles incoming requests
│
├── middlewares/
│ └── loggerMiddleware.js # Middleware for logging
│
├── services/
│ ├── healthCheckService.js # Service for health checking
│ ├── loadBalancerService.js # Main load balancer logic
│ └── queueService.js # Service for managing queue operations
│
├── utils/
│ ├── config.js # Utility for configuration handling
│ └── logger.js # Utility for logging functionality
│
├── .gitignore # Specifies intentionally untracked files to ignore
├── config.json # JSON configuration file
├── package-lock.json # Automatically generated for any operations where npm modifies either the node_modules tree, or package.json
├── package.json # Manifest file for Node.js projects, includes metadata (such as dependencies)
└── server.js # Main server file
```
## Features
- *Dynamic Load Balancing*: Distributes requests based on server health and request load.
- *Health Checks*: Regularly checks the health of servers to ensure traffic is only sent to operational servers.
- *CLI for Configuration*: Allows configuration through a command-line interface to easily manage server settings.
- *Support for Multiple Queueing Strategies*: Includes FIFO, priority, and round-robin queueing strategies.
- *Robust Logging*: Utilizes Winston for comprehensive logging of requests and system events.

## Technological Stack
- *Node.js*: Server runtime environment.
- *Express*: Web application framework.
- *Winston*: Logging library.
- *Axios*: Promise-based HTTP client.
- *Cron*: Used for scheduling tasks.
- *Inquirer.js*: Command line user interfaces.
- *Chalk*: Terminal string styling.

## Installation Instructions

| Command                                 | Description                                         |
|-----------------------------------------|-----------------------------------------------------|
| `git clone https://github.com/yourusername/load-balancer.git` <button onclick="navigator.clipboard.writeText('git clone https://github.com/yourusername/load-balancer.git')">Copy</button> | Clone the repository                               |
| `cd load-balancer` <button onclick="navigator.clipboard.writeText('cd load-balancer')">Copy</button>                      | Navigate to the project directory                   |
| `npm install` <button onclick="navigator.clipboard.writeText('npm install')">Copy</button>                           | Install dependencies                                |
| `npm start` <button onclick="navigator.clipboard.writeText('npm start')">Copy</button>                             | Start the server                                    |


This command will invoke the CLI to configure and initiate the load balancer server as specified in your settings.

## Configuration
Modify the config.json file to change the server settings, such as:
- serverCount: Number of servers to balance.
- servers: Array of server URLs.
- healthCheckEndpoint: Endpoint used for health checks.
- healthCheckPeriod: Time interval (in seconds) for health checks.


## Authors
- *Shivansh Gupta* 
