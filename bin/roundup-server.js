#!/usr/bin/env node
"use strict";
const clear = require("clear");
const figlet = require("figlet");
const fs = require("fs");
const os = require("os");
require("pkginfo")(module);
const winston = require("winston");

// Dependencies

// Services
const web = require("../lib/web");

const conf = require("rc")("roundup", {
  webPort: 9339,
  // Logging
  logLevel: "info",
  // paths
  tmpFolder: null,
  contentFolder: null,
});

// Configure winston logging
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  level: conf.logLevel,
  format: logFormat,
  transports: [new winston.transports.Console()],
});

clear();
logger.info(figlet.textSync("roundup", { horizontalLayout: "full" }));
logger.info(module.exports.version);
logger.info("Web Port: " + conf.webPort);

/**
 * Handle shutdown gracefully
 */
process.on("SIGINT", function () {
  gracefulShutdown();
});

/**
 * gracefulShutdown
 */
async function gracefulShutdown() {
  await web.stop();
  process.exit(0);
}

const dependencies = {
  serverConfig: conf,
  logger: logger,
};

// Start all our services
web.start(dependencies);
