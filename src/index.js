#!/usr/bin/env node
function main() {
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
    console.log(`Web Crawling starting at: "${baseURL}"`);
}

main()