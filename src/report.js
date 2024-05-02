export function printReport(pagesVisitCount) {
    const orderedKeys = Object.keys(pagesVisitCount).sort( (a, b) => pagesVisitCount[b] - pagesVisitCount[a] );

    for (const k of orderedKeys) {
        const [url, count] = [k, pagesVisitCount[k]];
        console.log(`Found ${count} internal links to ${url}`);
    }
}