HYPERGAP.presets.push(
    {
        name: "blackbg",
        sprite: "blackbg"
    },
    {
        name: "dog_menu1",
        sprite: "paradog1",
        events: [
            {
                name: "#setup", code: function(event) {
                    // this.setVar("#state", "IdleL");
                    // this.setVar("timer", 0);
                    // this.setVar("$text", "");
                    // var input = document.createElement("input");
                    // input.type = "text";
                    // input.style.position="absolute";
                    // input.style.bottom="20px";
                    // input.style.left="50"+ '\u0025' ;
                    // input.style["margin-left"]="-100px";
                    // input.style.width="200px";
                    // // input.value="Peter";
                    // input.id="name";
                    // document.body.appendChild(input); // put it into the DOM
                }
            },
            {
                name: "#collide", code: function(event) {
                    if (event.shape2kind == "point" && this.engine.getObject(event.object).instanceOf("basicMouse")) {
                        if (event.shape2id == 1) {
                            if (this.getVar("#state") != "BarkL") {
                                HYPERGAP.CONTROLLER.sendMessage("ClockworkEvent" + '\u0025' + "selectSkin" + '\u0025' + JSON.stringify({
                                    skin: this.getVar("skin"),
                                    player: HYPERGAP.CONTROLLER.player,
                                    name: "Some Dog"
                                }));
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
    }
);
