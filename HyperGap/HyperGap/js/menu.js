var itemArray = [
    { title: "Not a Cat", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#999" },
    { title: "Paradux", text: "Puzzle", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#530" },
    { title: "Another game", text: "?", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#a00" },
    { title: "JSonic the Edgehog", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#3ac" },
{ title: "Install game", text: "System", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#555", action: function () { installGameFromLocaFile(); } },
{ title: "Reboot", text: "System", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#555", action: function () { location = "splash.html" } },
];

itemArray.forEach(function (x, id) { x.tileId = id });


var tiles = [];
WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(tiles)
});
WinJS.UI.processAll().then(function () {
    document.getElementById("listView").winControl.addEventListener("iteminvoked", clickTile);
});


var itemArrayCopy = itemArray.map(function (x) { return x });

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

