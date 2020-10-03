"use strict";
let express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Routers
const api = require("./api");

let app = express();
let server = null;
const morgan = require("morgan");

let bodyParser = require("body-parser");

function start(dependencies) {
  if (
    dependencies.serverConfig.logLevel === "http" ||
    dependencies.serverConfig.logLevel === "verbose"
  ) {
    app.use(morgan("dev"));
  }
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(__dirname + "/../public"));
  app.set("view engine", "pug");
  app.use(fileUpload());

  let port = process.env.PORT || dependencies.serverConfig.webPort;
  const apiRouter = api.router(dependencies);
  app.use(apiRouter);
  server = app.listen(port, function () {
    dependencies.logger.info(
      "Listening on port: " + dependencies.serverConfig.webPort
    );
  });
}

async function stop() {
  if (server != null) {
    await server.close();
  }
}

module.exports.start = start;
module.exports.stop = stop;
