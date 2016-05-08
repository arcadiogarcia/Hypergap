var HYPERGAP = HYPERGAP || {};
HYPERGAP.MENU = {};

var itemArray = [];

var tiles = [];
WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(tiles)
});
WinJS.UI.processAll().then(function () {
    document.getElementById("listView").winControl.addEventListener("iteminvoked", clickTile);
});


var itemArrayCopy;

var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            var apps=JSON.parse(httpRequest.responseText).entries;
            itemArray = itemArray.concat(apps.map(function (x) { return { title: x.title._, text: x.description._, picture: x.icon._, color: x.color._, size: x.size._, publisher: x.publisher._, action: function () { HYPERGAP.apps.installGameFromURL("http://hypergap.azurewebsites.net/API/games/" + x.RowKey._+"/download", function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } } }));
            showMenu();
        } else {
            alert('There was a problem with the request.');
        }
    }
};
httpRequest.open('GET', "http://hypergap.azurewebsites.net/API/games");
httpRequest.send();



function addTile() {
    if (itemArrayCopy.length > 0) {
        Sample.ListView.data.push(itemArrayCopy.shift());
        setTimeout(addTile, 200);
    }
}

function showMenu() {
    itemArrayCopy = itemArray.map(function (x) { return x });
    itemArray.forEach(function (x, id) { x.tileId = id });
    addTile();
}

function clickTile(e) {
    var l = itemArray.filter(function (x) { return x.tileId == e.detail.itemIndex });
    if (l.length > 0 && l[0].action) {
        l[0].action()
    }
}

function showLoader(msg, progress) {
    document.getElementById("loadingOverlay").style.display = "block";
    document.getElementById("loadingMessage").innerHTML = msg;
    document.getElementById("loadingProgress").innerHTML = progress;
}

function hideLoader() {
    document.getElementById("loadingOverlay").style.display = "none";
}

HYPERGAP.CONTROLLER.sendMessageToNewControllers("LoadLevel%HyperGapMenuMirroring");
HYPERGAP.CONTROLLER.sendMessageToNewControllers("ClockworkEvent%LoadMenu%" + JSON.stringify(itemArray));

HYPERGAP.MENU.invoke = function (e) {
    var l = itemArray.filter(function (x) { return x.tileId == e });
    if (l.length > 0 && l[0].action) {
        l[0].action()
    }
}