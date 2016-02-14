var itemArray = [
    { title: "Not a Cat", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#999" },
    { title: "Paradux", text: "Puzzle", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#530" },
    { title: "Another game", text: "?", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#a00" },
    { title: "JSonic the Edgehog", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#3ac" },
    
    { title: "Not a Cat", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#999" },
    { title: "Paradux", text: "Puzzle", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#530" },
    { title: "Another game", text: "?", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#a00" },
    { title: "JSonic the Edgehog", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#3ac" },
    
    { title: "Not a Cat", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#999" },
    { title: "Paradux", text: "Puzzle", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#530" },
    { title: "Another game", text: "?", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#a00" },
    { title: "JSonic the Edgehog", text: "Platformer", picture: "http://try.buildwinjs.com/images/fruits/60Mint.png", color: "#3ac" }
];


var tiles=[];
WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(tiles)
});
WinJS.UI.processAll();


function addTile(){
    if(itemArray.length>0){
        Sample.ListView.data.push(itemArray.pop());
        setTimeout(addTile,200);
    }
}

addTile();