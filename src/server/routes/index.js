import express, { Router } from "express";
import * as paths from "../../../webpack/paths";
import { renderResponse } from "../serverRender";

const router = Router();

router.use(express.static(paths.outpath));

router.get("/", async (req, res, next) => {
    const content = await renderResponse();
    res.send(content).end();
});

export default router;