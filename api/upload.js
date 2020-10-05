"use strict";
const fs = require("fs");
const { exec } = require("child_process");

/**
 * The url path this handler will serve
 */
function path() {
  return "/api/upload";
}

/**
 * The http method this handler will serve
 */
function method() {
  return "post";
}

/**
 * handle
 * @param {*} req
 * @param {*} res
 * @param {*} dependencies
 */
async function handle(req, res, dependencies) {
  if (req.files == null || req.files.file == null) {
    res.send("Missing file upload");
    return;
  }

  if (req.body == null || req.body.contentPath == null) {
    res.send("Missing contentPath");
    return;
  }

  if (req.files.file != null && req.body.contentPath != null) {
    const incomingFile = req.files.file;
    const dir = dependencies.serverConfig.contentFolder + req.body.contentPath;
    if (!fs.existsSync(dir)) {
      const mkdirResult = await mkdir(dir, dependencies.logger);
      if (!mkdirResult) {
        logger.error("Error making the directory, unable to continue!");
        return res.status(500).send("Error receiving file");
      }
    }

    let incomingFilePath = dir + "/" + req.body.fileName;

    incomingFile.mv(incomingFilePath, function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.send("File uploaded!");
    });
  } else {
    res.send("Missing file or content path");
  }
}

async function mkdir(dir, logger) {
  return new Promise((resolve) => {
    exec("mkdir -p " + dir, (error, stdout, stderr) => {
      if (error) {
        logger.error(`mkdir error: ${error}`);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

module.exports.path = path;
module.exports.method = method;
module.exports.handle = handle;
