import "dotenv/config";

import express, { Response } from "express";
import cors from "cors";
import helmet from "helmet";
import corsConfig from "./config/cors.js";
import helmetConfig from "./config/helmet.js";
import {pinoHttp} from "pino-http";

import { registerRoutes } from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

export const app = express();

app.set("trust proxy", 1);

app.use(cors(corsConfig))
app.use(helmet(helmetConfig))
app.use(express.json({ limit: "10kb" }));
 app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === "/favicon.ico",
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
}));

registerRoutes(app);

app.use(
  notFoundHandler,
  errorHandler
)