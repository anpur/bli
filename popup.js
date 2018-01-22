const reactionDelay = 300;
const maxShortcut = 10;
const showLimit = 20;
let searchField;
let resultsDiv;
let currentSearch = null;

const onSubmit = () => {
    const results = document.getElementsByClassName('result');
    if (results.length === 1) {
        selectTab(parseInt(results[0].dataset.id));
    }

    if (results.length === 0) {
        return;
    }

    // TODO: select when many?
};

const search = query => {
    if (query === "" || query.length < 3) {
        return showInitialHelp();
    }

    var shortcuts = 0;

    const createTabSearchResultTile = tab => {
        const isTitle = tab.title.toLowerCase().includes(query.toLowerCase());
        var title = isTitle
            ? tab.title
            : tab.url;
        const matchStart = title.toLowerCase().indexOf(query.toLowerCase());

        title = title.substring(0, matchStart)
            + "<mark>" + title.substring(matchStart, matchStart + query.length) + "</mark>"
            + title.substring(matchStart + query.length);

        const number = shortcuts++ < maxShortcut
            ? "<span class='number'>" + (shortcuts !== 10 ? shortcuts : 0) + "</span>"
            : " ";

        return "<div class='result' data-id='" + tab.id + "'>"
            + number
            + "<img class='favicon-image' src='" + tab.favIconUrl + "' alt='favicon' />"
            + "<a href='#'>" + title + "</a>"
            + "<div class='hint'>" + (isTitle ? tab.url : tab.title) + "</div>"
            + "</div>";
    }

    chrome.tabs.query({}, tabs => {
        const matchesQuery = str => str
            .toLowerCase()
            .includes(query.toLowerCase());

        var filteredTabs = tabs
            .filter(tab => matchesQuery(tab.title) || matchesQuery(tab.url))
            .filter(tab => Number.isInteger(tab.id)) // skip not loaded tabs
            .map(createTabSearchResultTile);

        if (filteredTabs.length === 0) {
            return showNoResults(query);
        }

        if (filteredTabs.length > showLimit) {
            const totalCount = filteredTabs.length;
            filteredTabs.splice(showLimit);
            filteredTabs.push("<span class='grayed'>" + totalCount + " tabs were found but showing only " + showLimit + "</span>")
        }

        filteredTabs.splice(0, 0, "<span class='grayed'>press CTRL + # to open tab</span>")

        resultsDiv.innerHTML = filteredTabs.join('');

        Array.from(document.getElementsByClassName('result'))
            .forEach(function (result) {
                result.addEventListener('click', () => {
                    selectTab(parseInt(result.dataset.id));
                });
            });
    });

    resultsDiv.innerHTML = "Searching for " + query + "..."
};

const showInitialHelp = () => {
    resultsDiv.innerHTML = "<span class='grayed'>"
        + "<img src='icon-2x.png' alt='bli' /><br />Bli cat is both amazed and disgusted by the number of your tabs"
        + "</span>"
};

const showNoResults = (query) => {
    resultsDiv.innerHTML = "No results found";
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
    searchField.addEventListener('paste', onSearchChanged);
    searchField.addEventListener('input', onSearchChanged);
    searchField.addEventListener('change', onSubmit);
    searchField.addEventListener('keydown', () => {
        var numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

        if (event.key === 'Enter') {
            onSubmit();
        } else if (event.ctrlKey && numberKeys.indexOf(event.key) >= 0) {
            openShortcut(parseInt(event.key))
        } else {
            onSearchChanged();
        }
    });
    showInitialHelp();
});

const openShortcut = number => {
    const results = document.getElementsByClassName('result');

    const index = number === 0
        ? 10
        : number - 1;

    if (results.length < index) {
        return;
    }

    selectTab(parseInt(results[index].dataset.id));
};

const selectTab = id => {
    chrome.tabs.query({
        'highlighted': true,
        'currentWindow': true
    }, function (tabs) {
        chrome.tabs.update(id, { highlighted: true });
        tabs.filter(tab => tab.id !== id)
            .forEach(tab => chrome.tabs.update(tab.id, { highlighted: false }));        
    });
};