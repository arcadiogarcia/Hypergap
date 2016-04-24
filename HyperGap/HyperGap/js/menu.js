var HYPERGAP = HYPERGAP || {};
HYPERGAP.MENU = {};

var itemArray = [
    { title: "Not a Cat", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#999" },
    { title: "Paradux", text: "Puzzle", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#530" },
    { title: "Another game", text: "?", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#a00" },
    { title: "JSonic the Edgehog", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#3ac" },
{ title: "Install game", text: "System", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#555", action: function () { HYPERGAP.apps.installGameFromLocalFile(function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } },
{ title: "Download game", text: "System", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#555", action: function () { HYPERGAP.apps.installGameFromURL("https://github.com/arcadiogarcia/Hypergap/raw/master/Sample%20games/FlappyNinjaCat.hgp",function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } },
{ title: "Reboot", text: "System", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#555", action: function () { HYPERGAP.CONTROLLER.close(); location = "splash.html" } },
{ title: "Reset", text: "System", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#555", action: function () { HYPERGAP.CONTROLLER.close(); localStorage.clear(); location = "splash.html"; } }
];

itemArray = itemArray.concat(HYPERGAP.apps.getInstalledApps().map(function (x) { return { title: x.name, text: "Installed app", picture: "ms-appdata:///local/installedApps/" + x.name + "/" + x.scope + "/" + x.tileIcon, color: x.theme_color, action: function () { HYPERGAP.CONTROLLER.close(); HYPERGAP.apps.launchApp(x.name); } } }));

itemArray.forEach(function (x, id) { x.tileId = id });

var tiles = [];
WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(tiles)
});
WinJS.UI.processAll().then(function () {
    document.getElementById("listView").winControl.addEventListener("iteminvoked", clickTile);
});


var itemArrayCopy = itemArray.map(function (x) { return x });

var installedApps = HYPERGAP.apps.getInstalledApps();

function addTile() {
    if (itemArrayCopy.length > 0) {
        Sample.ListView.data.push(itemArrayCopy.shift());
        setTimeout(addTile, 200);
    }
}

addTile();

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