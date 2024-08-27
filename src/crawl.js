import { JSDOM } from "jsdom";

export async function crawlPage(baseURL, currURL = baseURL, visitedPages = {}) {
    // URL doesn't belong to the same domain
    if (getURLDomain(currURL) !== getURLDomain(baseURL)) {
        return visitedPages;
    }
    // sets or increments visited URLs
    const normalizedURL = normalizeURL(currURL);
    if (visitedPages[normalizedURL] > 0) {
        visitedPages[normalizedURL]++;
        return visitedPages;
    }
    visitedPages[normalizedURL] = 1;
    
    // get html
    let html;
    try {
        html = await getPageHTML(currURL);
    } catch (error) {
        return visitedPages;
    }

    // recursion logic
    const pageURLs = extractURLsFromHTML(html, baseURL);
    for (const url of pageURLs) {
        visitedPages = await crawlPage(baseURL, url, visitedPages);
    }

    return visitedPages;
}

export async function getPageHTML(url) {
    // fetching for page's html
    const response = await fetch(url, { method: "GET" });
    const { status, statusText, headers } = response;
    if (status >= 400) {
        throw new Error(`Status code of - ${status} ${statusText}`);
    }
    if (!headers.get("Content-Type").startsWith("text/html")) {
        throw new Error("Response content type was not text/html");
    }

    // got html successfully
    return await response.text();
}

/**
 * Returns a normalized version of the URL, e.g. https://google.com/path/ and https://google.com/path
 * will both return google.com/path (protocol doesn't matter as well). 
 * This is useful to compare if inputed URLs are the same.
 * @param {string} url
 * @returns {string} Normalized URL
 */
export function normalizeURL(url) {
    const { hostname, pathname } = new URL(url);
    let fullPath = `${hostname}${pathname}`;
    if (fullPath.slice(-1) === "/") {
        fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
}

/**
 * Get the URL domain '-'
 * @param {string} url
 * @returns {string} domain name
 */
export function getURLDomain(url) {
    return (new URL(url)).hostname;
}

/**
 * Return all the anchor tags' URLs present in a given HTML string
 * (converts relatives URLs to absolutes)
 * @param {string} htmlText
 * @param {string} baseURL Used to build absolute URLs
 * @returns {Array<string>} All <a> tags' URLs
 */
export function extractURLsFromHTML(htmlText, baseURL) {
    // maybe start using regex
    const dom = new JSDOM(htmlText);
    const anchors = dom.window.document.querySelectorAll('a');
    return Array.from(anchors, a => {
        try {
            return (new URL(a.href, baseURL)).href;
        } catch(err) {
            console.log(`${err.message}: ${a.href}`);
        }
    });
}