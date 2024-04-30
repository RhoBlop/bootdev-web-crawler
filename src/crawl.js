import { JSDOM } from "jsdom";

export async function crawlPage(rootURL) {
    // fetching for URL html
    const response = await fetch(rootURL, { method: "GET" });
    const { status, statusText, headers } = response;
    if (status >= 400) {
        throw new Error(`Status code of - ${status} ${statusText}`);
    }
    if (!headers.get("Content-Type").startsWith("text/html")) {
        throw new Error("Response content type was not text/html");
    }

    // got html successfully
    const html = await response.text();
    console.log(extractURLsFromHTML(html, rootURL));
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