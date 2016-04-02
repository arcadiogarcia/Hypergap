// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var basicClickPreset = [
{
    name: "basicMouse",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("listener_click", this.engine.getEngineVar("#DOM").addEventListener("click", (function (that) { return that.execute_event.curryThis(that, "onclick") })(this), false));
                this.setVar("listener_move", this.engine.getEngineVar("#DOM").addEventListener("mousemove", (function (that) { return that.execute_event.curryThis(that, "onmove") })(this), false));
                this.setVar("listener_move", this.engine.getEngineVar("#DOM").addEventListener("touchmove", (function (that) { return that.execute_event.curryThis(that, "onmove") })(this), false));
            }
        },
        {
            name: "#exit", code: function (event) {
                this.engine.getEngineVar("#DOM").removeEventListener("click", this.getVar("listener_click"));
                this.engine.getEngineVar("#DOM").removeEventListener("mousemove", this.getVar("listener_move"));
            }
        },
        {
            name: "onclick", code: function (e) {
                var cx, cy;
                cx = (e.offsetX == undefined ? e.layerX : e.offsetX);
                cy = e.offsetY == undefined ? e.layerY : e.offsetY;
                if (e.target != e.currentTarget) {
                    cx += e.target.offsetLeft;
                    cy += e.target.offsetTop;
                }

                if (window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width < window.innerHeight / CLOCKWORKCONFIG.screenbuffer_width) {
                    cx = CLOCKWORKCONFIG.screenbuffer_width * cx / window.innerWidth;
                    var ypos = (window.innerHeight - CLOCKWORKCONFIG.screenbuffer_height * window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width) / 2;
                    var height = (CLOCKWORKCONFIG.screenbuffer_height * window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width);
                    cy = CLOCKWORKCONFIG.screenbuffer_height * (cy - ypos) / height;
                } else {
                    cy = CLOCKWORKCONFIG.screenbuffer_height * cy / window.innerHeight;
                    var xpos = (window.innerWidth - CLOCKWORKCONFIG.screenbuffer_width * window.innerHeight / CLOCKWORKCONFIG.screenbuffer_height) / 2;
                    var width = (CLOCKWORKCONFIG.screenbuffer_width * window.innerHeight / CLOCKWORKCONFIG.screenbuffer_height);
                    cx = CLOCKWORKCONFIG.screenbuffer_width * (cx - xpos) / width;
                }
                this.collisionChanged();
                this.setVar("cX", cx);
                this.setVar("cY", cy);
                this.setVar("timer", -1);
                //Warning: This will only work if there is no scaling between the game coordinates and the canvas!
                //If you are using a custom Spritesheet.js renderMode, you will need to do something like this:
                //
                //cx=  e.clientX / window.innerWidth * 1366;
                //cy = (e.clientY - (window.innerHeight - 768 * window.innerWidth / 1366) / 2) * 1366 / window.innerWidth
                //
                // Where 1366x768 is the size of the buffer and the virtual game screens
            }
        },
         {
             name: "onmove", code: function (e) {
                 this.collision["point"][0].x = e.offsetX == undefined ? e.layerX : e.offsetX;
                 this.collision["point"][0].y = e.offsetY == undefined ? e.layerY : e.offsetY;

                 if (window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width < window.innerHeight / CLOCKWORKCONFIG.screenbuffer_width) {
                     this.collision["point"][0].x = CLOCKWORKCONFIG.screenbuffer_width * this.collision["point"][0].x / window.innerWidth;
                     var ypos = (window.innerHeight - CLOCKWORKCONFIG.screenbuffer_height * window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width) / 2;
                     var height = (CLOCKWORKCONFIG.screenbuffer_height * window.innerWidth / CLOCKWORKCONFIG.screenbuffer_width);
                     this.collision["point"][0].y = CLOCKWORKCONFIG.screenbuffer_height * (this.collision["point"][0].y - ypos) / height;
                 } else {
                     this.collision["point"][0].y = CLOCKWORKCONFIG.screenbuffer_height * this.collision["point"][0].y / window.innerHeight;
                     var xpos = (window.innerWidth - CLOCKWORKCONFIG.screenbuffer_width * window.innerHeight / CLOCKWORKCONFIG.screenbuffer_height) / 2;
                     var width = (CLOCKWORKCONFIG.screenbuffer_width * window.innerHeight / CLOCKWORKCONFIG.screenbuffer_height);
                     this.collision["point"][0].x = CLOCKWORKCONFIG.screenbuffer_width * (this.collision["point"][0].x - xpos) / width;
                 }
                 this.collisionChanged();
                 //Warning: Read the previous warning
             }
         },
         {
             name: "#loop", code: function (event) {
                 //We wait one iteration before deleting the click coordinates
                 if (this.getVar("timer") == 1) {
                     this.collision["point"][1].x = NaN;
                     this.collision["point"][1].y = NaN;
                     this.collisionChanged();
                     this.setVar("timer", 0);
                 }
                 if (this.getVar("timer") == -1) {
                     this.collision["point"][1].x = this.getVar("cX");
                     this.collision["point"][1].y = this.getVar("cY");
                     this.collisionChanged();
                     this.setVar("timer", 1);
                 }
             }
         }
    ],
    collision: {
        "point": [
            //Coordinates of the pointer
            { "x": 0, "y": 0 },
            //Coordinates of the click
            { "x": NaN, "y": NaN }
        ]
    }
}
];


