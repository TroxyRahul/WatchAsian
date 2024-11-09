import { Router } from "express";
import * as controller from "../controllers/shows.js";
import { WELCOME_BANNER } from "../utils/log.js";

const otherRouter = Router();

otherRouter.get("/", (req, res) => {
    res.send(`<pre>${WELCOME_BANNER}</pre>`);
});

otherRouter.get("/episode/:id", controller.handleGetEpisodeById);

otherRouter.get("/search", controller.handleSearch);

export default otherRouter;