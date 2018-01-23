const tabs = {
    searchForTabs: query => {
        resultsDiv.innerHTML = "Searching for " + query + " tab"
            + (searching.isExact(query) ? " exact" : "")
            + (searching.isRegexp(query) ? " regexp" : "");

        
    },
    match: (query, tab) => {

    }
};