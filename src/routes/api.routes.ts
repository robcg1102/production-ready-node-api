import { Router } from "express";


const router = Router();

router.get("/", async (_, res) => {

    return res.status(200).json({
        status: "OK"
    });

});

export default router;