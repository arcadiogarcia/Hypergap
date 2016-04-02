HYPERGAP.presets.push(
    {
        name: "accelerometer",
        events: [
            {
                name: "#setup", code: function(event) {
                    var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
                    console.log("Loading accelerometer?", this.engine.getEngineVar("acc_loaded"));
                    if (accelerometer) {
                        //&& !this.engine.getEngineVar("acc_loaded")
                        // Load the accelerometer only once per html page
                        this.engine.setEngineVar("acc_loaded", true);
                        console.log("Accelerometer loaded");
                        var minimumReportInterval = accelerometer.minimumReportInterval;
                        reportInterval = minimumReportInterval > 8 ? minimumReportInterval : 8
                        var engine = this.engine;
                        accelerometer.addEventListener("readingchanged", function(e) {
                            engine.execute_event("accelerometer_data", e);
                        });
                        // this.setVar("moving", false);
                        var oldx = 1, oldy = 1, oldz = 1;
                        this.setVar("oldx", oldx);
                        this.setVar("oldy", oldy);
                        this.setVar("oldz", oldz);
                        // this.setVar("min", 9999);
                        // this.setVar("max", 0);

                    }
                }
            }, {
                name: "#exit", code: function(event) {
                    // explode=please[explode].now;
                }
            }, {
                name: "accelerometer_data", code: function(event) {
                    var reading = event.reading;
                    // var moving = this.getVar("moving");
                    var newx = reading.accelerationX.toFixed(5);
                    var newy = reading.accelerationY.toFixed(5);
                    var newz = reading.accelerationZ.toFixed(5);
                    var oldx = this.getVar("oldx");
                    var oldy = this.getVar("oldy");
                    var oldz = this.getVar("oldz");
                    // var min = this.getVar("min");
                    // var max = this.getVar("max");
                    // var moduleSquared = (newx - oldx) * (newx - oldx) + (newy - oldy) * (newy - oldy) + (newz - oldz) * (newz - oldz);
                    // var moduleSquaredAbsolute = newx * newx + newy * newy + newz * newz;
                    // console.log(moduleSquared);
                    // if (moduleSquaredAbsolute > 2 && moving == false) {
                    //     moving = true;
                    //     HYPERGAP.CONTROLLER.sendMessage("a-button");
                    // }
                    // if (moduleSquaredAbsolute < 1.2 && moving == true) {
                    //     moving = false;
                    // }
                    if (Math.abs(newx - oldx) > 0.05 || Math.abs(newy - oldy) > 0.05 || Math.abs(newz - oldz) > 0.05) {
                        console.log(newx,newy,newz);
                        this.setVar("oldx", newx);
                        this.setVar("oldy", newy);
                        this.setVar("oldz", newz);
                        // this.setVar("moving", moving);
                        // // if (moduleSquared < min) {
                        //     this.setVar("min", moduleSquared);
                        // }
                        // if (moduleSquared > max) {
                        //     this.setVar("max", moduleSquared);
                        // }
                        // console.log(moduleSquared, min, max);
                        console.log("Sending", "ClockworkEvent" + '\u0025' + "setTilt" + '\u0025' + JSON.stringify({
                            x: newx,
                            y: newy,
                            z: newz,
                            player: HYPERGAP.CONTROLLER.player,
                        }))
                        HYPERGAP.CONTROLLER.sendMessage("ClockworkEvent" + '\u0025' + "setTilt" + '\u0025' + JSON.stringify({
                            x: newx,
                            y: newy,
                            z: newz,
                            player: HYPERGAP.CONTROLLER.player,
                        }));
                    }
                }
            }
        ]
    }
);
