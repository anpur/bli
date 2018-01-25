function searchForTabs(query) {
    const createTabResult = (tab, title, hint) => {
        return "<div class='result' data-id='" + tab.id + "' data-windowId='" + tab.windowId + "'>"
            + 0
            + "<img class='favicon-image' src='" + tab.favIconUrl + "' />"
            + "<a href='#'>" + title + "</a>"
            + "<div class='hint'>" + hint + "</div>"
            + "</div>";
    };

    chrome.tabs.query({}, tabs => {
        const matchedTabs = tabs.map(tab => {
            var match = markMatch(query, tab.title);
            if (match !== null) {
                return createTabResult(tab, match, tab.url);
            }

            match = markMatch(query, tab.url);
            return match !== null
                ? createTabResult(tab, match, tab.title)
                : null;
        }).filter(result => result !== null);

        resultsDiv.innerHTML = matchedTabs.join('<br>');
    });
}