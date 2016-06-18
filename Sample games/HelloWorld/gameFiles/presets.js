HYPERGAP.presets.push([
    {
        name: "talkingDog",
        sprite: "dog",
        events: [
            {
                name: "#setup", code: function (event) {
                    console.log("Preset loaded");
                    this.setVar("$text", "");
                    this.setVar("timer", 0);
                }
            },
            {
                name: "#loop", code: function (event) {
                    console.log("Preset loaded");
                    var t=this.getVar("timer");
                    this.setVar("timer", t+1);
                    if(t==100){
                        this.setVar("$text", "Hello World");
                        this.setVar("#state","BarkL");
                    }
                    if(t==150){
                        this.setVar("$text", "");
                        this.setVar("#state","RunR");
                    }
                    if(t>150){
                        this.setVar("#x",this.getVar("#x")+5);
                    }
                }
            }]
    }]);