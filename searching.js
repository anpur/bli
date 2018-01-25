function markMatch(query, text) {
    const regexpPattern = "^\/(.+)\/([gimuy]*)$";
    const begginingLimit = 10;

    const isExact = query => query.match("^'.*'$|^\".*\"$") != null;

    const isRegexp = query => query.match(regexpPattern) != null;

    const stringToRegexp = query => new RegExp(query.match(regexpPattern)[1],
        query.match(regexpPattern)[2]);

    const markText = (text, start, length) => text.substring(0, start)
        + "<mark>" + text.substring(start, start + length) + "</mark>"
        + text.substring(start + length);

    const trimLongBeginning = (text, start) => start > begginingLimit
        ? "..." + text.substring(begginingLimit)
        : text;

    const markExactMatch = (query, text) => {
        const trimedQuery = query.toLowerCase().substring(1, query.length - 1);
        const index = text.toLowerCase().indexOf(trimedQuery);
        if (index === -1) {
            return null;
        }

        return trimLongBeginning(markText(text, index, trimedQuery.length), index);
    };

    const markRegexpMatch = (text, regexp) => {
        const match = regexp.exec(text);
        if (match === null) {
            return null;
        }

        return trimLongBeginning(markText(text, match.index, match[0].length), match.index);
    };

    const markFuzzyMatch = (query, text) => {
        const options = {
            includeMatches: true,
            threshold: 0.6,
            location: 0,
            distance: 50,
            maxPatternLength: 32,
            minMatchCharLength: 2
        };

        const fuse = new Fuse([text], options);
        const match = fuse.search(query);
        if (match.length === 0 || match[0].matches.length === 0) {
            return null;
        }

        const indices = match[0].matches[0].indices;
        for (var i = indices.length - 1; i >= 0; i--) {
            text = markText(text, indices[i][0], indices[i][1] - indices[i][0]);
        }

        return trimLongBeginning(text, indices[indices.length - 1]);
    };

    if (isExact(query)) {
        return markExactMatch(query, text);
    } else if (isRegexp(query)) {
        return markRegexpMatch(text, stringToRegexp(query));
    } else {
        return markFuzzyMatch(query, text);
    }
}