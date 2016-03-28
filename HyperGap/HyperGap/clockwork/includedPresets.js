var HYPERGAP = HYPERGAP || {};

HYPERGAP.LIBRARIES = HYPERGAP.LIBRARIES || {};

HYPERGAP.LIBRARIES.getIncludedPresets = function () {
    return {
        mouse: [
{
    name: "mouse",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("listener_click", this.engine.getEngineVar("#DOM").addEventListener("click", (function (that) { return that.execute_event.curryThis(that, "onclick") })(this), false));
                this.setVar("listener_move", this.engine.getEngineVar("#DOM").addEventListener("mousemove", (function (that) { return that.execute_event.curryThis(that, "onmove") })(this), false));
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
        ],
        "notificationManager": [{
            name: "notificationManager",
            events: [
                {
                    name: "notificationToast", code: function (event) {

                        if (typeof Windows != 'undefined') {
                            var notifications = Windows.UI.Notifications;
                            //Get the XML template where the notification content will be suplied
                            var template = notifications.ToastTemplateType.toastText02;
                            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                            //Supply the text to the XML content
                            var toastTextElements = toastXml.getElementsByTagName("text");
                            toastTextElements[0].appendChild(toastXml.createTextNode(event.title));
                            toastTextElements[1].appendChild(toastXml.createTextNode(event.message));
                            //Specify a long duration
                            var toastNode = toastXml.selectSingleNode("/toast");
                            toastNode.setAttribute("duration", "long");
                            //Specify the audio for the toast notification
                            var audio = toastXml.createElement("audio");
                            audio.setAttribute("src", "ms-winsoundevent:Notification.IM");
                            //Specify launch paramater
                            toastXml.selectSingleNode("/toast").setAttribute("launch", event.launch);
                            //Create a toast notification based on the specified XML
                            var toast = new notifications.ToastNotification(toastXml);
                            //Send the toast notification
                            var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                            toastNotifier.show(toast);
                            if (typeof Windows.UI != 'undefined') {
                                var appView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();
                                appView.titleBar.backgroundColor = Windows.UI.Colors[event.color || "white"];
                                appView.titleBar.foregroundColor = Windows.UI.Colors.black;
                                setTimeout(function () {
                                    appView.titleBar.backgroundColor = Windows.UI.Colors[CLOCKWORKCONFIG.appbar_backgroundColor];
                                    appView.titleBar.foregroundColor = Windows.UI.Colors[CLOCKWORKCONFIG.appbar_foregroundColor];
                                }, 200);
                            }
                        }

                    }
                }
            ]
        }],
        "storage": [{
            name: "storage",
            events: [
                {
                    name: "#setup", code: function (event) {
                        if (typeof Windows != "undefined") {
                            this.setVar("platform", "Windows");
                            var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
                            if (!roamingSettings.values["HighPriority"]) {

                                var storage = new Windows.Storage.ApplicationDataCompositeValue();
                                roamingSettings.values["HighPriority"] = storage;
                            }
                            this.setVar("storage", roamingSettings.values["HighPriority"]);
                        }
                    }
                },
                {
                    name: "putStorage", code: function (event) {
                        switch (this.getVar("platform")) {
                            case "Windows":
                                var storage = this.getVar("storage");
                                storage.insert(event.property, event.value);
                                Windows.Storage.ApplicationData.current.roamingSettings.values["HighPriority"] = storage;
                                break;
                            default:
                                localStorage.setItem(event.property, event.value);
                                break;
                        }
                    }
                },
                 {
                     name: "getStorage", code: function (event) {
                         switch (this.getVar("platform")) {
                             case "Windows":
                                 return this.getVar("storage").lookup(event.property);
                             default:
                                 return localStorage.getItem(event.property);
                                 break;
                         }
                     }
                 },
            ]
        }],
        "keyboard": [
{
    name: "keyboard",
    events: [
        {
            name: "#setup", code: function (event) {
                var names = ["keyup", "keydown"];
                var tokens = [];

                for (var i in names) {
                    tokens[i] = this.execute_event.bind(this, names[i]);
                    window.addEventListener(names[i], tokens[i], false);
                }
                this.setVar("eventstoken", tokens);
            }
        },
        {
            name: "#exit", code: function (event) {
                var tokens = this.getVar("eventstoken");
                var names = ["keyup", "keydown"];
                for (var i in names) {
                    window.removeEventListener(names[i], tokens[i], false);
                }
            }
        },
        {
            name: "keydown", code: function (event) {
                this.engine.execute_event("keyboard_down", { key: event.keyCode });

            }
        },
          {
              name: "keyup", code: function (event) {
                  this.engine.execute_event("keyboard_up", { key: event.keyCode });
              }
          }
    ]
}
        ]
    };
};


HYPERGAP.LIBRARIES.getIncludedCollisions = function () {
    return {
        pointsAndBoxes: {
            shapes: ["point", "box"],
            detectors: [
                {
                    shape1: "point",
                    shape2: "box",
                    detector: function (p, b, data) {
                        if (p.x >= b.x && p.y >= b.y && p.x <= b.x + b.w && p.y <= b.y + b.h) {
                            data.x = (p.x - b.x) / b.w;
                            data.y = (p.y - b.y) / b.h;
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ]
        }
    };
};