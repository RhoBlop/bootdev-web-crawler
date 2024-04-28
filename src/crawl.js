/**
 * Returns a normalized version of the URL, e.g. https://google.com/path/ and https://google.com/path
 * will both return google.com/path (protocol doesn't matter as well). 
 * This is useful to compare if inputed URLs are the same.
 * @param {string} url
 * @returns {string} Normalized URL
 */
export function normalizeURL(url) {
    const { hostname, pathname } = new URL(url);
    let fullPath = `${hostname}${pathname}`
    if (fullPath.slice(-1) === "/") {
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}