var HYPERGAP = HYPERGAP || {};
HYPERGAP.STORE = {};

var itemArray = [];

var tiles = [];
WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(tiles)
});
WinJS.UI.processAll().then(function () {
    //document.getElementById("listView").winControl.addEventListener("iteminvoked", clickTile
    document.getElementById("buttonBack").addEventListener("click", navigationActions.goBack);
    document.getElementById("buttonSearch").addEventListener("click", function () { navigationActions.search(document.getElementById('searchBox').value) });
    navigationActions.topGames();
});


var itemArrayCopy;





function addTile() {
    if (itemArrayCopy.length > 0) {
        Sample.ListView.data.push(itemArrayCopy.shift());
        setTimeout(addTile, 100);
    } else {
        [].slice.call(document.getElementsByClassName("installbutton")).forEach(function (x) {
            x.addEventListener("click", function () { clickTile.apply(x) });
        });
        [].slice.call(document.getElementsByClassName("publisher")).forEach(function (x) {
            x.addEventListener("click", function () { clickPublisher.apply(x) });
        });

    }
}

function showMenu() {
    while (Sample.ListView.data.length > 0) {
        Sample.ListView.data.pop();
    }
    itemArrayCopy = itemArray.map(function (x) { return x });
    itemArray.forEach(function (x, id) { x.tileId = id });
    HYPERGAP.CONTROLLER.sendMessageToNewControllers("ClockworkEvent~LoadStore~" + JSON.stringify(itemArray));
    addTile();
}

function clickTile(id) {
    if (typeof id == "undefined") {
        var that = this;
        var l = itemArray.filter(function (x) { return x.tileId == that.tileId });
    } else {
        var l = itemArray.filter(function (x) { return x.tileId == id });
    }
    if (l.length > 0 && l[0].action) {
        l[0].action()
    }
}

function clickPublisher(e) {
    navigationActions.searchPublisher(this.innerText);
}

function showLoader(msg, progress) {
    document.getElementById("loadingOverlay").style.display = "block";
    document.getElementById("loadingMessage").innerHTML = msg;
    document.getElementById("loadingProgress").innerHTML = progress;
}

function hideLoader() {
    document.getElementById("loadingOverlay").style.display = "none";
}

HYPERGAP.CONTROLLER.sendMessageToNewControllers("LoadLevel~HyperGapStoreMirroring");




//Navigation stack
var navigationStack = [];
var navigationActions = {};
var currentState = null;

function navigateState(newstate) {
    if (currentState) {
        navigationStack.push(currentState);
    }
    currentState = newstate;
}

navigationActions.setTitle = function (title) {
    HYPERGAP.CONTROLLER.sendMessageToNewControllers("ClockworkEvent~updateTitle~" + title);
    document.getElementById("textHeader").innerHTML = title;
}

navigationActions.goBack = function () {
    if (navigationStack.length == 0) {
        HYPERGAP.CONTROLLER.close();
        window.location = "menu.html";
    } else {
        var previous = navigationStack.pop();
        navigationActions[previous.action](previous.args, true);
        currentState = previous;
    }
}

navigationActions.topGames = function (args, back) {
    if (!back) {
        navigateState({ action: "topGames" });
    }
    navigationActions.setTitle("Top Games");
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var apps = JSON.parse(httpRequest.responseText).entries;
                itemArray = apps.map(function (x) { return { title: x.title._, text: x.description._, picture: x.icon._, color: x.color._, size: x.size._, publisher: x.publisher._, action: function () { HYPERGAP.apps.installGameFromURL("http://hypergap.azurewebsites.net/API/games/" + x.RowKey._ + "/download", function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } } });
                showMenu();
            } else {
                alert('There was a problem with the request.');
            }
        }
    };
    httpRequest.open('GET', "http://hypergap.azurewebsites.net/API/games");
    httpRequest.send();
}

navigationActions.search = function (query, back) {
    if (!back) {
        navigateState({ action: "search", args: query });
    }
    navigationActions.setTitle("Results for '" + query + "'");
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var apps = JSON.parse(httpRequest.responseText).entries;
                itemArray = apps.map(function (x) { return { title: x.title._, text: x.description._, picture: x.icon._, color: x.color._, size: x.size._, publisher: x.publisher._, action: function () { HYPERGAP.apps.installGameFromURL("http://hypergap.azurewebsites.net/API/games/" + x.RowKey._ + "/download", function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } } });
                showMenu();
            } else {
                alert('There was a problem with the request.');
            }
        }
    };
    httpRequest.open('GET', "http://hypergap.azurewebsites.net/API/games/search/" + query);
    httpRequest.send();


}

navigationActions.searchPublisher = function (p, back) {
    if (!back) {
        navigateState({ action: "searchPublisher", args: p });
    }
    navigationActions.setTitle("Games from " + p);
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var apps = JSON.parse(httpRequest.responseText).entries;
                itemArray = apps.map(function (x) { return { title: x.title._, text: x.description._, picture: x.icon._, color: x.color._, size: x.size._, publisher: x.publisher._, action: function () { HYPERGAP.apps.installGameFromURL("http://hypergap.azurewebsites.net/API/games/" + x.RowKey._ + "/download", function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } } });
                showMenu();
            } else {
                alert('There was a problem with the request.');
            }
        }
    };
    httpRequest.open('GET', "http://hypergap.azurewebsites.net/API/games/publisher/" + p);
    httpRequest.send();
}



HYPERGAP.STORE.executeCommand = function (command) {
    console.log(command);
    switch (command[0]) {
        case "Install":
            clickTile(command[1]);
            break;
        case "SearchPublisher":
            navigationActions.searchPublisher(command[1]);
            break;
        case "BackButton":
            navigationActions.goBack();
            break;
        case "Search":
            navigationActions.search(command[1]);
            break;
    }
}