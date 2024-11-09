import * as service from "../services/shows.js";
import { logger } from "../utils/log.js";

export const handleGetAllShows = async (req, res) => {
    try {
        const page = req.query.page || 1;
        logger.info(`Getting all shows page ${page}`);
        const shows = await service.getAllShows(page);
        res.send(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const handleGetShowById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id || id === "") throw Error("Missing required parameter");
        logger.info(`Getting show with id ${id}`);
        const show = await service.getShowById(id);
        res.send(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const handleGetEpisodeById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id || id === "") throw Error("Missing required parameter");
        logger.info(`Getting episode with id ${id}`);
        const show = await service.getEpisodeById(id);
        res.send(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const handleSearch = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if(!keyword || keyword === "") throw Error("Missing required parameter");
        logger.info(`Searching for ${keyword}`);
        const shows = await service.search(keyword);
        res.send(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}