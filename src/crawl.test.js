import { test, expect, describe } from "@jest/globals";
import { normalizeURL } from "./crawl";

const expectedBaseURL = "google.com"

describe("Normalize URL function", () => {
    test("url trailing slash removed", () => {
        const url = "https://google.com/"
        expect(normalizeURL(url)).toBe(expectedBaseURL)
    });
    
    test("url paths stay", () => {
        const urlPath = "myImage/test"
        const url = `https://google.com/${urlPath}`
        expect(normalizeURL(url)).toBe(`${expectedBaseURL}/${urlPath}`)
    });
    
    test("url paths trailing slash removed", () => {
        const urlPath = "myImage/test"
        const url = `https://google.com/${urlPath}/`
        expect(normalizeURL(url)).toBe(`${expectedBaseURL}/${urlPath}`)
    });
    
    test("url ports removed", () => {
        const urlPath = "myImage"
        const url = `https://google.com:3000/${urlPath}/`
        expect(normalizeURL(url)).toBe(`${expectedBaseURL}/${urlPath}`)
    });
    
    test("url protocols removed", () => {
        const https = "https://google.com"
        const http = "http://google.com"
        expect(normalizeURL(https)).toBe(expectedBaseURL)
        expect(normalizeURL(http)).toBe(expectedBaseURL)
    });
});

describe("Extract URLs function", () => {

});