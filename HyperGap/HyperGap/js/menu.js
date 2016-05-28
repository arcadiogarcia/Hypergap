var HYPERGAP = HYPERGAP || {};
HYPERGAP.MENU = {};

var itemArray = [
    { title: "Browse Store", text: "System", picture: "images/tiles/store.png", color: "#555", action: function () { HYPERGAP.CONTROLLER.close(); location = "store.html" } },
{ title: "Install game", text: "System", picture: "images/tiles/install.png", color: "#555", action: function () { HYPERGAP.apps.installGameFromLocalFile(function () { HYPERGAP.CONTROLLER.close(); location = "menu.html"; }); } },
{ title: "Reboot", text: "System", picture: "images/tiles/reboot.png", color: "#555", action: function () { HYPERGAP.CONTROLLER.close(); location = "splash.html" } },
{ title: "Reset", text: "System", picture: "images/tiles/reset.png", color: "#555", action: function () { HYPERGAP.CONTROLLER.close(); localStorage.clear(); location = "splash.html"; } }
];

itemArray = itemArray.concat(HYPERGAP.apps.getInstalledApps().map(function (x) { return { title: x.name, text: "Installed app", picture: "ms-appdata:///local/installedApps/" + x.name + "/" + x.scope + "/" + x.tileIcon, color: x.theme_color, action: function () { HYPERGAP.CONTROLLER.close(); HYPERGAP.apps.launchApp(x.name); } } }));

itemArray.forEach(function (x, id) { x.tileId = id });

var order;
if (localStorage["__menuLayout__"]) {
    order=JSON.parse(localStorage["__menuLayout__"]);
    itemArray.sort(function (a, b) { console.log(a.tileId,order[a.tileId] ,b.tileId,order[b.tileId]); return order[a.tileId] - order[b.tileId]; });
}

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
    if (order) {
        var realIndex = e.detail.itemIndex;
        for(var k in order){
            if (order[k] == e.detail.itemIndex) {
                realIndex = k;
            }
        }
        var l = itemArray.filter(function (x) { return x.tileId == realIndex;});
    } else {
        var l = itemArray.filter(function (x) { return x.tileId == e.detail.itemIndex });
    }
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

HYPERGAP.CONTROLLER.sendMessageToNewControllers("LoadLevel~HyperGapMenuMirroring");
HYPERGAP.CONTROLLER.sendMessageToNewControllers("ClockworkEvent~LoadMenu~" + JSON.stringify(itemArray));

HYPERGAP.MENU.invoke = function (e) {
    var l = itemArray.filter(function (x) { return x.tileId == e });
    if (l.length > 0 && l[0].action) {
        l[0].action()
    }
}

Sample.ListView.data.onitemmoved = function (e) {
    order = {};
    Sample.ListView.data._getArray().forEach(function (x, i) { order[x.tileId] = i; });
    localStorage["__menuLayout__"] = JSON.stringify(order);
}