HYPERGAP.presets.push([
 
    {
        name: "emulator",
        events: [
            {
                name: "#setup", code: function(event) {
                    document.body.innerHTML+='<iframe src="https://archive.org/embed/msdos_Pac-Man_1983" width="100%" height="100%" style="position:absolute;top:0px;left:0px;" frameborder="0"></iframe>';
                }
            },
            {
                name: "keyboard_down", code: function(event) {
                    if (event.key == 66) {
                        if (HYPERGAP) {
                            HYPERGAP.API.loadMenu();
                        }
                    }
                }
            }
        ]
    }
]);
