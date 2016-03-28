// Preset for the Clockwork engine
// Arcadio Garcia Salvadores
var sound = [
{
    name: "sound_pool",
    events: [
        {
            name: "#setup", code: function (event) {
                var soundNames = this.getVar("sounds");
                var sounds = {};
                for (var i = 0; i < soundNames.length; i++) {
                    var thisSound = new Audio("clockwork/assets/sounds/" + soundNames[i] + '.mp3');
                    thisSound.loop = false;
                    sounds[soundNames[i]]=[thisSound];
                }
                this.setVar("soundPool", sounds);
            }
        },
        {
            name: "play", code: function (event) {
                var soundArray = this.getVar("soundPool")[event];
                if (soundArray != undefined) {
                    var thisSound = soundArray[0];
                    thisSound.play();
                    if(sound.length==1){
                        soundArray.push(new Audio(thisSound.src));
                        soundArray.push(new Audio(thisSound.src));
                    }
                    thisSound.addEventListener("ended", function () {
                        soundArray.push(thisSound);
                    });
                    soundArray.splice(0,1);
                }
            }
        },
        {
            name: "#exit", code: function (event) {
                this.setVar("soundPool", undefined);
            }
        }
    ]
}
];
