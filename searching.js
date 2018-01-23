const regexpPattern = "^\/(.+)\/([gimuy]*)$";
const begginingLimit = 10;

const searching = {
    isExact: query => query.match("^'.*'$|^\".*\"$") != null,

    isRegexp: query => query.match(regexpPattern) != null,

    stringToRegexp: query => new RegExp(query.match(regexpPattern)[1],
        query.match(regexpPattern)[2]),

    markText: (text, start, length) => text.substring(0, start)
        + "<mark>" + text.substring(matchStart, index + length) + "</mark>"
        + text.substring(start + length),

    trimLongBeginning: (text, start) => start > begginingLimit
        ? "…" + text.substring(begginingLimit)
        : text,

    markExactMatch: (query, text) => {
        const trimedQuery = query.toLowerCase().substring(1, query.length - 1);
        const index = text.toLowerCase().indexOf(trimedQuery);
        if (index === -1) {
            return null;
        }

        return trimLongBeginning(
            markText(text, index, trimedQuery.length), index);
    },

    markRegexpMatch: (query, regexp) => {
        const match = regexp.exec(query);
        if (match === null) {
            return null;
        }

        return trimLongBeginning(
            markText(text, match.index, match[0].length), match.index);
    }
};