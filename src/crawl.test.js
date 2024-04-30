import { test, expect, describe } from "@jest/globals";
import { extractURLsFromHTML, normalizeURL } from "./crawl";

describe("Normalize URL Function", () => {
    const expectedBaseURL = "google.com"

    test("trailing slash removed", () => {
        const url = "https://google.com/"
        expect(normalizeURL(url)).toEqual(expectedBaseURL)
    });
    
    test("paths stay", () => {
        const urlPath = "myImage/test"
        const url = `https://google.com/${urlPath}`
        expect(normalizeURL(url)).toEqual(`${expectedBaseURL}/${urlPath}`)
    });
    
    test("path's trailing slash removed", () => {
        const urlPath = "myImage/test"
        const url = `https://google.com/${urlPath}/`
        expect(normalizeURL(url)).toEqual(`${expectedBaseURL}/${urlPath}`)
    });
    
    test("ports removed", () => {
        const urlPath = "myImage"
        const url = `https://google.com:3000/${urlPath}/`
        expect(normalizeURL(url)).toEqual(`${expectedBaseURL}/${urlPath}`)
    });
    
    test("protocols removed", () => {
        const https = "https://google.com"
        const http = "http://google.com"
        expect(normalizeURL(https)).toEqual(expectedBaseURL)
        expect(normalizeURL(http)).toEqual(expectedBaseURL)
    });
});

describe("Extract URLs Function", () => {
    const baseUrl = "https://google.com";

    test("absolute urls", () => {
        const expectedURLs = [ "https://google.com/" ];
        const html = `<html><body>
            <a href="https://google.com/"></a>
        </body></html>`;
        const actualURLs = extractURLsFromHTML(html, baseUrl);
        expect(actualURLs).toEqual(expectedURLs);
    });

    test("relative urls", () => {
        const expectedURLs = [ "https://google.com/about/company" ];
        const html = `<html><body>
            <a href="/about/company"></a>
        </body></html>`;
        const actualURLs = extractURLsFromHTML(html, baseUrl);
        expect(actualURLs).toEqual(expectedURLs);
    });

    test("multiple anchors", () => {
        const expectedURLs = [ "https://google.com/", "https://google.com/image/logo.png", "https://google.com/about/company/" ];
        const html = `<html><body>
            <a href="https://google.com/"></a>
            <div><a href="/image/logo.png"></a></div>
            <a href="/about/company/"></a>
        </body></html>`;
        const actualURLs = extractURLsFromHTML(html, baseUrl);
        expect(actualURLs).toEqual(expectedURLs);
    });

    test("urls only from anchors", () => {
        const expectedURLs = [ "https://google.com/" ];
        const html = `<html><body>
            <a href="https://google.com/"></a>
            <div><image src="/image/logo.png" /></div>
            <div href="/about/company/"></diva>
        </body></html>`;
        const actualURLs = extractURLsFromHTML(html, baseUrl);
        expect(actualURLs).toEqual(expectedURLs);
    });
});