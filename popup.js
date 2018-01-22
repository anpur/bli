const reactionDelay = 300;
let searchField;
let resultsDiv;
let currentSearch = null;



const search = query => {
    if (query === "" || query.length < 3) {
        return showInitialHelp();
    }

    const createTabSearchResultTile = tab => {
        var title = tab.title.includes(query)
            ? tab.title
            : tab.url;
        const matchStart = title.toLowerCase().indexOf(query.toLowerCase());

        title = title.substring(0, matchStart) 
            + "<mark>" + title.substring(matchStart, matchStart + query.length) + "</mark>"
            + title.substring(matchStart + query.length);

        //title = title.replace(query, "<strong>" + query + "</strong>");

        return "<div class='result' data-id='" + tab.id + "'>"
            + "<img class='favicon-image' src=" + tab.favIconUrl + "/>"
            + "<a href='#'>" + title + "</a></div>";
    }

    chrome.tabs.query({}, tabs => {
        const matchesQuery = str => str
            .toLowerCase()
            .includes(query.toLowerCase());

        const filteredTabs = tabs
            .filter(tab => matchesQuery(tab.title) || matchesQuery(tab.url))
            .filter(tab => Number.isInteger(tab.id)) // skip not loaded tabs
            .map(createTabSearchResultTile);

        if (filteredTabs.length === 0) {
            return showNoResults(query);
        }
        resultsDiv.innerHTML = filteredTabs.join('');

        Array.from(document.getElementsByClassName('result'))
            .forEach(function (result) {
                result.addEventListener('click', () => {
                    chrome.tabs.update(
                        parseInt(result.dataset.id), 
                        { highlighted: true });
                });
            });
    });

    resultsDiv.innerHTML = "Searching for " + query + "..."
};

const showInitialHelp = () => {
    resultsDiv.innerHTML = "Search..."
};

const showNoResults = (query) => {
    resultsDiv.innerHTML = "No results found for '" + query + "'";
};

const onSearchChanged = () => {
    const searchValue = searchField.value;
    currentSearch = searchValue;
    setTimeout(() => {
        if (currentSearch === searchValue) {
            currentSearch = null;
            search(searchValue);
        }
    }, reactionDelay);
};

document.addEventListener('DOMContentLoaded', () => {
    searchField = document.getElementById('search');
    resultsDiv = document.getElementById('results');
    searchField.addEventListener('change', onSearchChanged);
    searchField.addEventListener('keydown', onSearchChanged);
    searchField.addEventListener('paste', onSearchChanged);
    searchField.addEventListener('input', onSearchChanged);
    showInitialHelp();
});