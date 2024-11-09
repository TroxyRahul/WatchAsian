import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config.js";
import { logger } from "../utils/log.js";
import { decode, decrypt, encode, encrypt } from "../utils/cipher.js";
import { extractIdAndDomainFromUrl, extractShows } from "../utils/extractor.js";

const baseUrl = config.DRAMA.DOMAIN;

class Scraper {
    constructor() {
        this.baseUrl = baseUrl;
    }

    // Method to make a GET request to the specified URL
    async fetchData(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            logger.error("Error fetching data");
            throw new Error("Error fetching data");
        }
    }

    // Method to scrape popular shows
    async scrapePopularShows(page = 1) {
        try {
            const html = await this.fetchData(`${this.baseUrl}/most-popular-drama?page=${page}`);
            return extractShows(html);
        } catch (error) {
            logger.error("Error scraping popular shows");
            throw new Error("Error scraping popular shows");
        }
    }

    // Method to scrape show by ID
    async scrapeShowById(id) {
        try {
            id = decode(id);
            const html = await this.fetchData(`${this.baseUrl}/drama-detail/${id}`);
            const $ = cheerio.load(html);

            const titleWithReleaseYear = $(".details .info h1").text();
            const title = titleWithReleaseYear.replace(/\((\d{4})\)/, "").trim();
            const poster = $(".details img").attr("src");
            const info = $(".details .info p");
            const description = info.eq(3).text();
            const yearString = $('p:contains("Released")').text().replace('Released:', '').trim();
            const year = parseInt(yearString?.match(/\d{4}/)[0]) ?? null;

            const durationString = $('p:contains("Duration")').text().replace('Duration:', '').trim();
            const duration = durationString?.replaceAll('.', '');
            const country = $('p:contains("Country")').first().text().replace('Country:', '').trim();
            const status = $('p:contains("Status")').text().replace('Status:', '').trim();

            const genres = [];
            $('p:contains("Genre") a').each((i, el) => {
                genres.push($(el).text().trim());
            });

            const otherNames = [];

            $(".details .other_name > a").each((index, element) => {
                const ele = $(element);
                const name = ele.text().trim();
                otherNames.push(name);
            });

            const episodes = [];

            $(".all-episode > li").each((index, element) => {
                const ele = $(element);
                const episodeString = ele.find("a h3")?.text()?.trim()?.split("Episode ")[1];
                const episode = parseInt(episodeString?.match(/\d+/)[0])?? null;
                const id = encode(ele.find("a").attr("href"));
                const time = ele.find(".time").text();
                const type = ele.find(".type").text();
                episodes.push({ episode, id, time, type });
            });

            const totalEpisodes = episodes.length;

            const cast = [];

            $(".slider-star > .item").each((index, element) => {
                const ele = $(element);
                const name = ele.find("img")?.attr("alt")?.replace(/\s*\(.*?\)\s*/g, '')?.trim()
                const image = ele.find("img").attr("src");
                cast.push({ name, image });
            });

            return { title, description, poster, episodes, cast, totalEpisodes, duration, country, status, year, genres, otherNames };;
        } catch (error) {
            logger.error(`Error scraping show: ${id}`);
            throw new Error(`Error scraping show: ${id}`);
        }
    }

    async getPlayableUrl(domain, id) {
        try {
            const encId = encrypt(id);
            const response = await axios.get(`https://${domain}/encrypt-ajax.php?id=${encId}`);
            const { data } = response.data;
            const payload = decrypt(data);
            const jsonPayload = JSON.parse(payload);
            if (jsonPayload.source.length > 0) {
                return jsonPayload.source[0].file;
            }
            return null;
        } catch (error) {
            console.log(error)
            logger.error(`Error scraping playable URL: ${id}`);
            throw new Error(`Error scraping playable URL: ${id}`);
        }
    }

    // Method to scrape episode by ID for a specific show
    async scrapeEpisodeById(episodeId) {
        try {
            episodeId = decode(episodeId);
            const html = await this.fetchData(`${this.baseUrl}${episodeId}`);
            const $ = cheerio.load(html);

            const playableUrl = $("iframe").attr("src");
            const { id, domain } = extractIdAndDomainFromUrl(playableUrl);

            const data = await this.getPlayableUrl(domain, id);
            return { url: data };
        } catch (error) {
            logger.error(`Error scraping episode: ${episodeId}`);
            throw new Error(`Error scraping episode: ${episodeId}`);
        }
    }

    // Method to scrape search
    async scrapeSearch(keyword) {
        try {
            const html = await this.fetchData(`${this.baseUrl}/search?keyword=${keyword}`);
            return extractShows(html);
        } catch (error) {
            logger.error(`Error scraping search: ${keyword}`);
            throw new Error(`Error scraping search: ${keyword}`);
        }
    }
}

export default Scraper;
