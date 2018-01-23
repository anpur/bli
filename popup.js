const reactionDelay = 300;
const maxShortcut = 10;
const showLimit = 20;
const ignoreLength = 3;

const historyPrefix = "h ";
const bookmarkPrefix = "b ";
const textPrefix = "t ";
const prefixes = [historyPrefix, bookmarkPrefix, textPrefix];

let searchField;
let resultsDiv;

function onDocumentReady() {
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
            onShortcut(parseInt(event.key))
        } else {
            onSearchChanged();
        }
    });

    showInitialHelp();
}

function onSearchChanged() {
    const searchValue = searchField.value;
    currentSearch = searchValue;
    setTimeout(() => {
        if (currentSearch === searchValue) {
            currentSearch = null;
            search(searchValue);
        }
    }, reactionDelay);
}

function showInitialHelp() {
    resultsDiv.innerHTML = "<span class='grayed'>"
        + "<img src='icon-2x.png' alt='bli' style='float: right;' />"
        + "Bli cat is both amazed and disgusted by the number of your tabs.<br /><br />"
        + "To start BLI with a shortcut open <a href='#' id='open-extensions'>Extensions</a> and click <em>Keyboard shortcuts</em> on the bottom right"
        + " (<kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> is recomended)."
        + "</span>";

    document.getElementById('open-extensions').addEventListener('click', e => {
        chrome.tabs.create({ url: "chrome://extensions" });
    });
};

function search(query) {
    const potentialPrefix = query.substring(0, 2).toLowerCase();
    const potentialPrefixedQuery = query.substring(2);

    // Ignore seqrch query less than x
    const hasPrefix = prefixes.indexOf(potentialPrefix) != -1;
    const ignoreIfSmaller = ignoreLength + (hasPrefix ? 2 : 0);
    if (query.length < ignoreIfSmaller) {
        return showInitialHelp();
    }

    // Query type
    switch (potentialPrefix) {
        case bookmarkPrefix: return searchForBookmark(potentialPrefixedQuery);
        case historyPrefix: return searchForHistory(potentialPrefixedQuery);
        case textPrefix: return searchForText(potentialPrefixedQuery);
        default: return tabs.searchForTabs(query);
    }
}

function searchForBookmark(query) {
    resultsDiv.innerHTML = "Searching for " + query + " bookmark";
}

function searchForHistory(query) {
    resultsDiv.innerHTML = "Searching for " + query + " in history";
}

function searchForText(query) {
    resultsDiv.innerHTML = "Searching for " + query + " in text";
}

function onSubmit() {
}

function onShortcut(number) {
}

document.addEventListener('DOMContentLoaded', onDocumentReady);
