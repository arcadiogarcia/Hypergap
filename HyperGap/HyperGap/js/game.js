var CLOCKWORKCONFIG;

(function () {
    window.onload = function () {

        var manifest = HYPERGAP.API.getManifest();
       
        //List of presets, only two operations: push and read
        //This allows to detect when all the callbacks have been executed
        HYPERGAP.presets = (function () {
            var presetList = [];
            var remainingPresets = manifest.presets.length;
            return {
                push: function (x) {
                    //Array
                    if (x && x.length > 0) {
                        x.forEach(x=> presetList.push(x));
                    }
                    //Element
                    if (x && x.length == undefined) {
                        presetList.push(x);
                    }
                    remainingPresets--;
                    if (remainingPresets == 0) {
                        readyToGo();
                    }
                },
                getPresets: function () {
                    return presetList;
                }
            };
        })();

        CLOCKWORKCONFIG = {
            enginefps: manifest.enginefps,
            animationfps: manifest.animationfps,
            screenbuffer_width: manifest.screenResolution.w,
            screenbuffer_height: manifest.screenResolution.h
        };

        manifest.presets.forEach(function (x) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = HYPERGAP.API.appPath() + "/" + x;
            document.body.appendChild(script);
        });

        document.getElementById("canvas").style.width = window.innerWidth;
        document.getElementById("canvas").style.height = window.innerHeight;
        document.getElementById("canvas").width = window.innerWidth;
        document.getElementById("canvas").height = window.innerHeight;

        function readyToGo() {
            setUpAnimation(setUpEngine);
        }


        function setUpAnimation(callback) {
            var canvasAnimation = new Spritesheet();
            canvasAnimation.setUp(document.getElementById("canvas"), CLOCKWORKCONFIG.animationfps);
            canvasAnimation.setBufferSize(CLOCKWORKCONFIG.screenbuffer_width, CLOCKWORKCONFIG.screenbuffer_height);
            canvasAnimation.setRenderMode(function (contextinput, contextoutput) {
                contextoutput.clearRect(0, 0, contextoutput.canvas.width, contextoutput.canvas.height);
                //All the width available will be used, the aspect ratio will be the same and the image will be centered vertically
                if (contextoutput.canvas.width / contextinput.canvas.width < contextoutput.canvas.height / contextinput.canvas.height) {
                    var xpos = 0;
                    var ypos = (contextoutput.canvas.height - contextinput.canvas.height * contextoutput.canvas.width / contextinput.canvas.width) / 2;
                    var width = contextoutput.canvas.width;
                    var height = (contextinput.canvas.height * contextoutput.canvas.width / contextinput.canvas.width);
                } else {
                    var xpos = (contextoutput.canvas.width - contextinput.canvas.width * contextoutput.canvas.height / contextinput.canvas.height) / 2;
                    var ypos = 0;
                    var width = (contextinput.canvas.width * contextoutput.canvas.height / contextinput.canvas.height);
                    var height = contextoutput.canvas.height;
                }
                contextoutput.drawImage(contextinput.canvas, xpos, ypos, width, height);
            });
            canvasAnimation.setFullScreen();
            canvasAnimation.setWorkingFolder("ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope);
            canvasAnimation.asyncLoad(manifest.spritesheets.map(x=>"ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope + "/"+x), (function (c) { return function () { callback(c) }; })(canvasAnimation));
        }


        function setUpEngine(animLib) {
            var engineInstance = new Clockwork();
            engineInstance.setAnimationEngine(animLib);
            manifest.dependencies.collisions.map(x=> HYPERGAP.LIBRARIES.getIncludedCollisions()[x]).filter(x=>x).forEach(engineInstance.registerCollision);
            manifest.dependencies.presets.map(x=> HYPERGAP.LIBRARIES.getIncludedPresets()[x]).filter(x=>x).forEach(engineInstance.loadPresets);
            engineInstance.loadPresets(HYPERGAP.presets.getPresets());

            manifest.levels.map(x=>"ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope + "/"+x).recursiveForEach(function (x,cb) {
                engineInstance.loadLevelsFromXML(x, cb);
            }, 0, function () {
                engineInstance.start(CLOCKWORKCONFIG.enginefps, document.getElementById("canvas"));
            });
        }
        Object.defineProperty(Array.prototype, 'recursiveForEach', {
            enumerable:false,
         value:function (action, index, cb) {
             var i = index || 0;
             if (i >= this.length) {
                 return cb();
             }
             var that = this;
             return action(this[i], function () { that.recursiveForEach(action, i + 1,cb); });
         }
        });
    };
})();