// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var game_presets = [
{
    name: "dog",
    sprite: "paradog",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#state", "RunR");
                this.setVar("timer", 0);
                this.setVar("vy", 0);
                this.setVar("ay", 0.5);
                this.setVar("alive", true);
            }
        },
        {
            name: "#collide", code: function (event) {
                if (this.getVar("alive") == true) {
                    if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                        if (event.shape2id == 1) {
                            this.setVar("#state", "BarkR");
                            this.setVar("vy", -8);
                            this.setVar("timer", 28);
                        }
                    }
                }
            }
        },
		{
		    name: "#loop", code: function (event) {
		        if (this.getVar("#x") < 100) {
		            this.setVar("#x", this.getVar("#x") + 5);
		        }
		        if (this.getVar("alive") == true) {
		            if (this.getVar("#y") < 0 || this.getVar("#y") > 400) {
		                this.engine.execute_event("gameover");
		            }
		            if (this.getVar("timer") > 0) {
		                this.setVar("timer", this.getVar("timer") - 1);
		                if (this.getVar("timer") == 0) {
		                    this.setVar("#state", "RunR");
		                }
		            }
		        } else {
		            if (this.getVar("#y") > 420) {
		                this.engine.loadLevelByID("menu");
		                return "#exit";
		            }
		        }
		        if (this.getVar("vy") < 5) {
		            this.setVar("vy", this.getVar("vy") + this.getVar("ay"));
		        }
		        this.setVar("#y", this.getVar("#y") + this.getVar("vy"));
		    }
		},
        {
            name: "gameover", code: function (event) {
                this.setVar("alive", false);
                this.setVar("vy", 0);
                this.setVar("#state", "ScareR");
            }
        }
    ],
    collision: {
        "box": [
            //All the screen
            { "x": -1000, "y": -1000, "w": 2000, "h": 2000 },
        ],
        "point": [
            //Front
           { "x": 57, "y": 28 },
           //Top
           { "x": 28, "y": 0 },
           //Bottom
           { "x": 28, "y": 57 },
        ]
    }
},
{
    name: "pipe",
    sprite: "pipe",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("#x", 830);
                this.setVar("moving", true);
            }
        },
        {
            name: "#collide", code: function (event) {
                if (this.getVar("moving") == true && event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("dog")) {
                    this.engine.execute_event("gameover");
                }
            }
        },
        {
            name: "gameover", code: function (event) {
                this.setVar("moving", false);
            }
        },
		{
		    name: "#loop", code: function (event) {
		        if (this.getVar("moving") == true) {
		            this.setVar("#x", this.getVar("#x") - 10);
		            if (this.getVar("#x") < -100) {
		                this.setVar("#x", 830);
		                var y = 195 + Math.random() * 150;
		                this.setVar("#y", y);
		                this.engine.execute_event("movepipe", { "y": y });
		                this.engine.execute_event("addpoints", { "points": 1 });
		            }
		        }
		    }
		}
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 100, "h": 300 },
        ]
    }
},
{
    name: "pipe_reverse",
    inherits: "pipe",
    events: [
        {
            name: "#setup", code: function (event) {
                this.setVar("moving", true);
                this.setVar("#state", "reverse");
                this.setVar("#x", 830);
            }
        },
         {
             name: "movepipe", code: function (event) {
                 this.setVar("#y", event.y - 430);
                 this.setVar("#x", 830);
             }
         },
         {
             name: "#loop", code: function (event) {
                 if (this.getVar("moving") == true) {
                     this.setVar("#x", this.getVar("#x") - 10);
                 }
             }
         }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 100, "h": 300 },
        ]
    }
},
{
    name: "background",
    sprite: "background"
},
{
    name: "static_background",
    inherits: "background",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("#state", "idle");
           }
       }
    ],
},
{
    name: "button",
    sprite: "button",
    events: [
       {
           name: "#collide", code: function (event) {
               if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                   if (event.shape2id == 1) {
                       this.engine.loadLevelByID("game");
                   }
               }
           }
       }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 200, "h": 100 },
        ]
    }
},
{
    name: "text",
    sprite: "centeredText",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("$text", "Looking for an HyperGap in the local network");
               this.setVar("$color", "#FFF");
           }
       }
    ]
},
{
    name: "generic-button",
    events: [
      {
          name: "#collide", code: function (event) {
              if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                  if (event.shape2id == 0) {
                      this.setVar("#state", "down");
                      this.setVar("timer", 5);
                  }
                  if (event.shape2id == 1) {
                      if (Windows.Phone) {
                          Windows.Phone.Devices.Notification.VibrationDevice.getDefault().vibrate(50);
                      }
                      if (HYPERGAP.CONTROLLER.sendMessage) {
                          HYPERGAP.CONTROLLER.sendMessage(this.getVar("command"));
                      }
                  }
              }
          }
      },
      {
          name: "#loop", code: function (event) {
              var t = this.getVar("timer") || 0;
              if (t == 0) {
                  this.setVar("#state", "up");
              } else {
                  this.setVar("timer", t - 1);
              }
          }
      }
    ]
},
{
    name: "dpad-right",
    inherit: "generic-button",
    sprite: "dpad-right",
    vars: [{name:"command", vaue:"right"}],
    collision: {
        "box": [
            { "x": 50, "y": 0, "w": 150, "h": 150 },
        ]
    }
},
{
    name: "dpad-left",
    inherit: "generic-button",
    sprite: "dpad-left",
    vars: [{name:"command", vaue:"left"}],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 150, "h": 150 },
        ]
    }
},

{
    name: "dpad-up",
    sprite: "dpad-up",
    inherit: "generic-button",
    vars: [{ name: "command", vaue: "up" }],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 150, "h": 150 },
        ]
    }
},
{
    name: "dpad-down",
    sprite: "dpad-down",
    events: [
      {
          name: "#collide", code: function (event) {
              if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                  if (event.shape2id == 0) {
                      this.setVar("#state", "down");
                  }
                  if (event.shape2id == 1) {
                      if (Windows.Phone) {
                          Windows.Phone.Devices.Notification.VibrationDevice.getDefault().vibrate(50);
                      }
                      if (HYPERGAP.CONTROLLER.sendMessage) {
                          HYPERGAP.CONTROLLER.sendMessage("up");
                      }
                  }
              }
          }
      }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 50, "w": 150, "h": 150 },
        ]
    }
},

{
    name: "a-button",
    sprite: "a-button",
    events: [
      {
          name: "#collide", code: function (event) {
              if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                  if (event.shape2id == 0) {
                      this.setVar("#state", "down");
                      this.setVar("timer", 5);
                  }
                  if (event.shape2id == 1) {
                      if (Windows.Phone) {
                          Windows.Phone.Devices.Notification.VibrationDevice.getDefault().vibrate(50);
                      }
                      if (HYPERGAP.CONTROLLER.sendMessage) {
                          HYPERGAP.CONTROLLER.sendMessage("a-button");
                      }
                  }
              }
          }
      },
      {
          name: "#loop", code: function (event) {
              var t = this.getVar("timer")||0;
              if (t == 0) {
                  this.setVar("#state", "up");
              } else {
                  this.setVar("timer", t - 1);
              }
          }
      }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 200, "h": 200 },
        ]
    }
},
{
    name: "b-button",
    sprite: "b-button",
    events: [
      {
          name: "#collide", code: function (event) {
              if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                  if (event.shape2id == 0) {
                      this.setVar("#state", "down");
                  }
                  if (event.shape2id == 1) {
                      if (Windows.Phone) {
                          Windows.Phone.Devices.Notification.VibrationDevice.getDefault().vibrate(50);
                      }
                      if (HYPERGAP.CONTROLLER.sendMessage) {
                          HYPERGAP.CONTROLLER.sendMessage("b-button");
                      }
                  }
              }
          }
      }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 200, "h": 200 },
        ]
    }
},
{
    name: "blackbg",
    sprite: "blackbg"
},
{
    name: "score",
    sprite: "text",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("points", 0);
               this.setVar("$text", "Score: " + this.getVar("points"));
               this.setVar("$color", "#F00");
           }
       },
        {
            name: "addpoints", code: function (event) {
                this.setVar("points", this.getVar("points") + event.points);
                this.setVar("$text", "Score: " + this.getVar("points"));
                if (this.getVar("points") > +(this.engine.find("mystorage").execute_event("getStorage", { "property": "maxscore" }) || 0)) {
                    this.setVar("HighScore", true);
                    this.engine.find("mystorage").execute_event("putStorage", { "property": "maxscore", "value": this.getVar("points") });
                    this.setVar("$color", "#0F0");
                }
            }
        },
        {
            name: "gameover", code: function (event) {
                if (this.getVar("HighScore")) {
                    this.engine.execute_event("notificationToast", { message: this.getVar("points"), title: "New high score", color: "cyan" });
                }
            }
        }
    ]
},
{
    name: "maxscore",
    sprite: "text",
    events: [
       {
           name: "#setup", code: function (event) {
               this.setVar("$text", "High score: " + (this.engine.find("mystorage").execute_event("getStorage", { "property": "maxscore" }) || 0));
               this.setVar("$color", "#FF0");
           }
       }
    ]
},
{
    name: "mirroredMenu",
    events: [
       {
           name: "#setup", code: function (event) {
               var element = document.createElement("div");
               element.id = "menuDiv";
               element.style.position = "absolute";
               element.style.top = "0px";
               element.style.left = "0px";
               element.style.width = "100%";
               element.style.height = "100%";
               document.body.appendChild(element);
               var tiles = [];
               WinJS.Namespace.define("Sample.ListView", {
                   data: new WinJS.Binding.List(tiles)
               });
               var list = new WinJS.UI.ListView(element, {
                   itemDataSource: Sample.ListView.data.dataSource,
                   itemTemplate: document.getElementById('smallListIconTextTemplate'),
                   selectionMode: 'none',
                   tapBehavior: 'invokeOnly',
                   itemsReorderable: true,
                   layout: { type: WinJS.UI.GridLayout }
               });
               WinJS.UI.processAll().then(function () {
                   list.addEventListener("iteminvoked", clickTile);
               });
               var that = this;
               function clickTile(e) {
                   var itemArray = that.getVar("itemArray");
                   HYPERGAP.CONTROLLER.sendMessage("MenuClick%" + e.detail.itemIndex);
                   that.execute_event("#exit");
               }

           }
       },
        {
            name: "LoadMenu", code: function (event) {
                if (!this.getVar("itemArray")) {
                    var itemArray = JSON.parse(event);
                    var itemArrayCopy = itemArray.map(function (x) { return x });
                    function addTile() {
                        if (itemArrayCopy.length > 0) {
                            Sample.ListView.data.push(itemArrayCopy.shift());
                            setTimeout(addTile, 200);
                        }
                    }
                    this.setVar("itemArray", itemArray);
                    addTile();
                }
            }
        },
         {
             name: "#exit", code: function (event) {
                 if(document.getElementById("menuDiv")){
                     document.body.removeChild(document.getElementById("menuDiv"));
                 }
                 console.log("Im out")
             }
         }
    ]
},
{
    name: "splashButton",
    sprite: "splash",
    events: [
      {
          name: "#collide", code: function (event) {
              if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                  if (event.shape2id == 0) {
                      this.setVar("#state", "down");
                  }
                  if (event.shape2id == 1) {
                      if (Windows.Phone) {
                          Windows.Phone.Devices.Notification.VibrationDevice.getDefault().vibrate(50);
                      }
                      if (HYPERGAP.CONTROLLER.sendMessage) {
                          HYPERGAP.CONTROLLER.sendMessage("b-button");
                      }
                  }
              }
          }
      }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 200, "h": 200 },
        ]
    }
},
{
    name: "splashButton",
    sprite: "splash",
    events: [
      {
          name: "#collide", code: function (event) {
              if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                  if (event.shape2id == 1) {
                      this.setVar("#state", "progress");
                      if (HYPERGAP.CONTROLLER.sendMessage) {
                          HYPERGAP.CONTROLLER.sendMessage("startSplash");
                      }
                  }
              }
          }
      }
    ],
    collision: {
        "box": [
            { "x": 0, "y": 0, "w": 1280, "h": 720 },
        ]
    }
}
];
