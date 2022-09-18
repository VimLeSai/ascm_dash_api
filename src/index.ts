const bodyParser = require("body-parser");
const express = require("express");

const cors = require("cors");
import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import apiRoutes from "./routes";

import { AppDataSource } from "./data-source";

(function () {
  AppDataSource.initialize()
    .then(async () => {
      console.log("Database has been initialized.");
    })
    .catch((error) => console.log(error));
})();

// create and setup express app
const app = express();

app.use(express.json());
// Health Check endpoints
app.get("/status", (req, res) => {
  res.status(200).json("Ok");
});

app.head("/status", (req, res) => {
  res.status(200).end();
});

app.enable("trust proxy");

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());

// Use Helmet to secure the app by setting various HTTP headers
app.use(helmet());

// Middleware that transforms the raw string of req.body into json
app.use(bodyParser.json());

// Load API routes
app.use(`/`, apiRoutes);

/// Error handlers
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error("Error: %o", err);
    res.status(400).json({ error: "Invalid data" }).end();
  } else {
    next(err);
  }
});

// start express server
app.listen(3000, () => console.log("server running on 3000 port"));
