import { Express } from "express";

import healthRoutes from "./health.routes.js";
import metricRoutes from "./metric.routes.js";
import apiRoutes from "./api.routes.js";

import { apiLimiter } from "../middlewares/rateLimiter.js";


export const registerRoutes = (app: Express): void => {
 
    app.get("/", (_, res)=> {
        return res.status(200).json({
            api: "OK"
        });
    })

    app.use("/api", apiLimiter, apiRoutes)

    app.use("/health", healthRoutes);

    app.use("/metrics", metricRoutes);
};