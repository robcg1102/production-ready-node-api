import { Router } from "express";

import { register } from "../lib/metrics.js";

const router = Router();

router.get("/", async (_, res) => {
    res.setHeader("Cache-Control", "no-store");

    res.setHeader("Content-Type", register.contentType);

    res.end(await register.metrics());

});

export default router;