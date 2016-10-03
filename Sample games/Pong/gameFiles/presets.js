HYPERGAP.presets.push([
    {
        name: "bar",
        sprite: "bar",
        collision: {
            "box": [
                { "#tag": "hitbox", "x": -2, "y": -10, "w": 5, "h": 20 }
            ]
        }
    },
    {
        name: "playerBar",
        inherits: "bar",
        events: [
            {
                name: "keyboard_down", code: function (event) {
                    if (event.key == 38) {
                        this.setVar("#y", this.getVar("#y") - 10);
                    }
                    if (event.key == 40) {
                        this.setVar("#y", this.getVar("#y") + 10);
                    }
                }
            },
            {
                name: "gamepadDown", code: function (event) {
                    if (event.name == "DU") {
                        this.setVar("#y", this.getVar("#y") - 10);
                    }
                    if (event.name == "DD") {
                        this.setVar("#y", this.getVar("#y") + 10);
                    }
                }
            },
            {
                name: "updateScore", code: function (event) {
                    if (event.won == "AI") {
                        this.setVar("#state", "lost");
                        var that = this;
                        setTimeout(function () {
                            that.setVar("#state", "idle");
                        }, 2000);
                    }
                }
            }
        ]
    },
    {
        name: "enemyBar",
        inherits: "bar",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setVar("vy", 0);
                }
            },
            {
                name: "#loop", code: function (event) {
                    var ballX = this.engine.find("ball").getVar("#x");
                    var barX = this.getVar("#x");
                    var ballY = this.engine.find("ball").getVar("#y");
                    var barY = this.getVar("#y");

                    if (Math.abs(ballX - barX) < 50) {
                        if (Math.abs(ballY - barY) > 4) {
                            if (barY > ballY) {
                                this.setVar("vy", this.getVar("vy") - 1);
                            } else if (barY < ballY) {
                                this.setVar("vy", this.getVar("vy") + 1);
                            }
                        }
                    } else {
                        if (barY > 185) {
                            this.setVar("vy", this.getVar("vy") - 1);
                        } else if (barY < 15) {
                            this.setVar("vy", this.getVar("vy") + 1);
                        }
                    }
                    if (Math.abs(this.getVar("vy")) > 2) {
                        this.setVar("vy", this.getVar("vy") * 2 / 3);
                    }
                    this.setVar("#y", this.getVar("#y") + this.getVar("vy"));
                }
            },
            {
                name: "updateScore", code: function (event) {
                    if (event.won == "player") {
                        this.setVar("#state", "lost");
                        var that = this;
                        setTimeout(function () {
                            that.setVar("#state", "idle");
                        }, 2000);
                    }
                }
            }
        ]
    },
    {
        name: "ball",
        sprite: "ball",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setVar("vx", 1);
                    this.setVar("vy", 1);
                }
            },
            {
                name: "#loop", code: function (event) {
                    if (this.getVar("#y") < 0 || this.getVar("#y") > 200) {
                        this.setVar("vy", -1 * this.getVar("vy"));
                        // this.setVar("#y", this.getVar("#y") + 2*this.getVar("vy"));
                    }
                    this.setVar("#x", this.getVar("#x") + this.getVar("vx"));
                    this.setVar("#y", this.getVar("#y") + this.getVar("vy"));

                    if (this.getVar("#x") < 5) {
                        this.setVar("#x", 160);
                        this.setVar("#y", 50);
                        this.engine.execute_event("updateScore", { won: "AI" });
                    }
                    if (this.getVar("#x") > 315) {
                        this.setVar("#x", 160);
                        this.setVar("#y", 50);
                        this.engine.execute_event("updateScore", { won: "player" });
                    }
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.setVar("vx", -1 * this.getVar("vx"));
                    this.setVar("#x", this.getVar("#x") + this.getVar("vx"));
                }
            }
        ],
        collision: {
            "point": [
                { "x": 0, "y": 0 }
            ]
        }
    },
    {
        name: "score",
        sprite: "score",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setVar("$player", 0);
                    this.setVar("$AI", 0);
                }
            },
            {
                name: "updateScore", code: function (event) {
                    if (event.won == "player") {
                        this.setVar("$player", this.getVar("$player") + 1);
                    }
                    if (event.won == "AI") {
                        this.setVar("$AI", this.getVar("$AI") + 1);
                    }
                }
            }
        ]
    }

]);