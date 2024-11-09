import express from "express";
import config from "./config.js";
import { printWelcome, logger, WELCOME_BANNER } from "./utils/log.js";
import showsRouter from "./routes/shows.js";
import otherRouter from "./routes/others.js";

const server = express();

// parse request's body as JSON
server.use(express.json());

// register routes
server.use("/", otherRouter)
server.use("/shows", showsRouter);

server.listen(config.SERVER.PORT, config.SERVER.HOST, () => {
    printWelcome();
    logger.info(`Server is running on ${config.SERVER.HOST}:${config.SERVER.PORT}`);
});