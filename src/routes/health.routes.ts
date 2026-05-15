import { Router } from "express";

import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (_, res) => {
    res.setHeader("Cache-Control", "no-store");

    try {

        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({

            status: "healthy",

            uptime: process.uptime(),

            timestamp: new Date().toISOString(),

            services: {

                api: "up",

                database: "connected"
            }
        });

    } catch(error){
        
        return res.status(503).json({

            status: "unhealthy",

            uptime: process.uptime(),

            timestamp: new Date().toISOString(),

            services: {

                api: "up",

                database: "disconnected"
            }
        });
    }
});



router.get("/live", (_, res) => {
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({

        status: "alive",

        uptime: process.uptime(),

        timestamp: new Date().toISOString()
    });
});



router.get("/ready", async (_, res) => {

    res.setHeader("Cache-Control", "no-store");

    try {

        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({

            status: "ready",

            database: "connected"
        });

    } catch {

        return res.status(503).json({

            status: "not ready",

            database: "disconnected"
        });
    }
});



export default router;