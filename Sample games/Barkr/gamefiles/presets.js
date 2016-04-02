HYPERGAP.presets.push([
    {
        name: "dogSpawner",
        events: [
            {
                name: "selectSkin", code: function(event) {
                    event = JSON.parse(event);
                    var dog = this.engine.addObjectLive("remoteDog" + event.player, "dog" + event.skin, 100 + 700 * Math.random(), 600);
                    dog.setVar("id", event.player);
                    dog.setVar("$text", event.name);
                    dog.setVar("dogSkin", event.skin);
                    HYPERGAP.CONTROLLER.sendMessage("PrivateCommand" + '\u0025' + event.player + '\u0025' + "LoadLevel" + '\u0025' + "dogController");
                }
            },
            {
                name: "incomingBark", code: function(event) {
                    this.engine.execute_event("newmessage");
                    var chat = this.engine.addObjectLive("someChatBox", "chatBox", event.x, 140);
                    chat.setVar("$text", event.text);
                    chat.setVar("$color", event.color);
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
    },
    {
        name: "chatBox",
        sprite: "text",
        events: [
            {
                name: "#setup", code: function(event) {
                    this.setVar("timer", 0);
                    this.setVar("ytarget", this.getVar("#y"));
                }
            },
            {
                name: "#loop", code: function(event) {
                    if (this.getVar("ytarget") < this.getVar("#y")) {
                        this.setVar("#y", this.getVar("#y") - 2);
                    }
                    this.setVar("timer", this.getVar("timer") + 1);
                    if (this.getVar("timer") > 700) {

                    }
                }
            },
            {
                name: "newmessage", code: function(event) {
                    this.setVar("ytarget", this.getVar("ytarget") - 20);
                }
            }
        ]
    },
    {
        name: "dog_menu1",
        sprite: "paradog1",
        events: [
            {
                name: "#setup", code: function(event) {
                    this.setVar("#state", "IdleL");
                    this.setVar("timer", 0);
                    this.setVar("$text", "");
                }
            },
            {
                name: "#collide", code: function(event) {
                    if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                        if (event.shape2id == 1) {
                            if (this.getVar("#state") != "BarkL") {
                                var name = window.prompt("Write your name", "Max");
                                if (name != null) {
                                    this.engine.setEngineVar("dogName", name);
                                    this.setVar("#state", "BarkL");
                                    this.setVar("timer", 14);
                                    window.setTimeout(function(that) {
                                        that.engine.setEngineVar("dogSkin", that.getVar("skin"));
                                        that.engine.loadLevel(that.engine.getEngineVar("#currentlevel") + 1);
                                    }, 400, this);
                                }
                            }
                        }
                        if (event.shape2id == 0 && this.getVar("timer") == 0) {
                            this.setVar("#state", "SeeUL");
                            this.setVar("timer", 14);
                        }
                    }
                }
            },
            {
                name: "#loop", code: function(event) {
                    if (this.getVar("timer") > 0) {
                        this.setVar("timer", this.getVar("timer") - 1);
                        if (this.getVar("timer") == 0) {
                            this.setVar("#state", "IdleL");
                        }
                    }
                }
            }
        ],
        collision: {
            "box": [
                { "x": 0, "y": 0, "w": 120, "h": 120 },
            ]
        },
        vars: [
            { "name": "skin", "value": 1 }
        ]
    },
    {
        name: "dog_menu2",
        sprite: "paradog2",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 2 }
        ]
    },
    {
        name: "dog_menu3",
        sprite: "paradog3",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 3 }
        ]
    },
    {
        name: "dog_menu4",
        sprite: "paradog4",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 4 }
        ]
    },
    {
        name: "dog_menu5",
        sprite: "paradog5",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 5 }
        ]
    },
    {
        name: "dog_menu6",
        sprite: "paradog6",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 6 }
        ]
    },
    {
        name: "dog_menu7",
        sprite: "paradog7",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 7 }
        ]
    },
    {
        name: "dog_menu8",
        sprite: "paradog8",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 8 }
        ]
    },
    {
        name: "dog_menu9",
        sprite: "paradog9",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 9 }
        ]
    },
    {
        name: "dog_menu10",
        sprite: "paradog10",
        inherits: "dog_menu1",
        vars: [
            { "name": "skin", "value": 10 }
        ]
    },
    {
        name: "dog1",
        sprite: "paradog1",
        events: [
            {
                name: "#setup", code: function(event) {
                    this.setVar("#state", "IdleL");
                    this.setVar("timer", 0);
                    this.setVar("goingto", this.getVar("#x"));
                    this.setVar("lookto", "L");
                    this.setVar("$text", this.engine.getEngineVar("dogName"));
                    //this.setVar("$%stream%",true);
                    this.engine.execute_event("@createDog", { name: this.engine.getEngineVar("dogName"), skin: this.engine.getEngineVar("dogSkin"), x: this.getVar("#x"), "%keep%": true });
                }
            },
            {
                name: "setGoingTo", code: function(event) {
                    this.setVar("goingto", event + this.getVar("#x") - 55);
                }
            },

            {
                name: "keyboard_down", code: function(event) {
                    if (event.key == 65 && event.player == this.getVar("id")) {
                        this.execute_event("bark", "Bark!")
                    }
                    if (event.key == 37 && event.player == this.getVar("id")) {
                        this.setVar("goingto", this.getVar("#x") + 100);
                    }
                    if (event.key == 39 && event.player == this.getVar("id")) {
                        this.setVar("goingto", this.getVar("#x") - 100);
                    }
                }
            },
            {
                name: "bark", code: function(event) {
                    if (this.getVar("timer") == 0) {
                        var name = event;
                        if (name != null) {
                            var color = "#FFF";
                            switch (this.getVar("dogSkin")) {
                                case 1:
                                    color = "#d09d3a";
                                    break;
                                case 2:
                                    color = "#aa785f";
                                    break;
                                case 3:
                                    color = "#768993";
                                    break;
                                case 4:
                                    color = "#fff";
                                    break;
                                case 5:
                                    color = "#959595";
                                    break;
                                case 6:
                                    color = "#43434a";
                                    break;
                                case 7:
                                    color = "#6c9d80";
                                    break;
                                case 8:
                                    color = "#d68ac6";
                                    break;
                                case 9:
                                    color = "#bfe0ff";
                                    break;
                                case 10:
                                    color = "#b3aa56";
                                    break;
                            }
                            this.engine.execute_event("newmessage");
                            var chat = this.engine.addObjectLive("someChatBox", "chatBox", this.getVar("#x") + 55, this.getVar("#y") - 100);
                            chat.setVar("$text", name);
                            chat.setVar("$color", color);
                            this.setVar("#state", "Bark" + this.getVar("lookto"));
                            this.setVar("timer", 30);
                        }
                    }
                }

            },
            {
                name: "#loop", code: function(event) {
                    if (this.getVar("timer") == 0) {
                        var gt = this.getVar("goingto");
                        var x = this.getVar("#x");
                        if (gt > x + 6) {
                            //  this.engine.getAnimationEngine().moveCameraX(6);
                            this.setVar("#x", this.getVar("#x") + 6);
                            this.setVar("#state", "RunR");
                            this.setVar("lookto", "R");
                        } else if (gt < x - 6) {
                            //  this.engine.getAnimationEngine().moveCameraX(-6);
                            this.setVar("#x", this.getVar("#x") - 6);
                            this.setVar("#state", "RunL");
                            this.setVar("lookto", "L");
                        } else {
                            this.setVar("#state", "Idle" + this.getVar("lookto"));
                        }
                    } else {
                        this.setVar("timer", this.getVar("timer") - 1);
                    }

                }
            }
        ],


    },

    {
        name: "dog2",
        sprite: "paradog2",
        inherits: "dog1"
    },
    {
        name: "dog3",
        sprite: "paradog3",
        inherits: "dog1"
    },
    {
        name: "dog4",
        sprite: "paradog4",
        inherits: "dog1"
    },
    {
        name: "dog5",
        sprite: "paradog5",
        inherits: "dog1"
    },
    {
        name: "dog6",
        sprite: "paradog6",
        inherits: "dog1"
    },
    {
        name: "dog7",
        sprite: "paradog7",
        inherits: "dog1"
    },
    {
        name: "dog8",
        sprite: "paradog8",
        inherits: "dog1"
    },
    {
        name: "dog9",
        sprite: "paradog9",
        inherits: "dog1"
    },
    {
        name: "dog10",
        sprite: "paradog10",
        inherits: "dog1"
    },
    {
        name: "bg",
        sprite: "bg",
    }

]);
