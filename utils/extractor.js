import  * as cheerio from "cheerio";
import { encode } from "./cipher.js";

const extractPageNumber = (url) => {
    return url.match(/page=(\d+)/)?.[1];
}

export const extractIdAndDomainFromUrl = (urlText) => {
    const idRegex = /[?&]id=([^&]+)/;
    const domainRegex = /\/\/([^\/]+)/;

    const idMatch = urlText.match(idRegex);
    const domainMatch = urlText.match(domainRegex);

    const id = idMatch ? idMatch[1] : null;
    const domain = domainMatch ? domainMatch[1] : null;

    return { id, domain };
}

export const extractShows = (html) => {
    const $ = cheerio.load(html);
    const shows = [];

    $(".switch-block > li").each((index, element) => {
        const ele = $(element);
        const id = encode(ele.find("a").attr("href").split("/")[2]);
        const titleWithReleaseYear = ele.find("h3").text();
        const title = titleWithReleaseYear.replace(/\((\d{4})\)/, "").trim();
        const releaseYear = titleWithReleaseYear.match(/\((\d{4})\)/)?.[1];
        const poster = ele.find("img").attr("data-original");
        const show = { id, title, poster, releaseYear };
        shows.push(show);
    });

    const page = $(".pagination .selected > a")?.attr("data-page");

    const totalLink = $(".pagination .last > a")?.attr("href");

    const total = extractPageNumber(totalLink ?? "");

    const pageInfo = {
        current: parseInt(page ?? 1),
        total: parseInt(total ?? 1)
    }

    return { page: pageInfo, data: shows };
}