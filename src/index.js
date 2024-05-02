#!/usr/bin/env node
import { crawlPage } from "./crawl.js";

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("No URL argument received");
        process.exit(1);
    }
    if (args.length > 1) {
        console.log("More than one argument received");
        process.exit(1);
    }

    const baseURL = args[0];
    console.log(`Crawling Root URL: "${baseURL}"...`);
    console.log(await crawlPage(baseURL));  
}

main()