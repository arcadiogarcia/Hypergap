﻿var CLOCKWORKCONFIG;

(function () {
    window.onload = function () {

        Object.defineProperty(Array.prototype, 'recursiveForEach', {
            enumerable: false,
            value: function (action, index, cb) {
                var i = index || 0;
                if (i >= this.length) {
                    return cb();
                }
                var that = this;
                return action(this[i], function () { that.recursiveForEach(action, i + 1, cb); });
            }
        });

        var manifest = HYPERGAP.API.getManifest();

        document.body.style["background-color"]=manifest.backgroundColor||"black";
       
        //List of presets, only two operations: push and read
        //This allows to detect when all the callbacks have been executed
        HYPERGAP.presets = (function () {
            var presetList = [];
            //var remainingPresets = manifest.presets.length;
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
                    //remainingPresets--;
                    //if (remainingPresets == 0) {
                    //    readyToGo();
                    //}
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

        manifest.presets.recursiveForEach(function (file, cb) {
            var uri = new Windows.Foundation.Uri(HYPERGAP.API.appPath() + "/" + file);
            console.log(uri);
            var file = Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).done( function (file) {
                Windows.Storage.FileIO.readTextAsync(file).done(function (x) {
                    eval(x); //Dirty AF
                    cb();
                });
            }, function(x){
                console.log(x);
            });


            //var script = document.createElement('script');
            //script.type = 'text/javascript';
            //script.src = HYPERGAP.API.appPath() + "/" + x;
            //document.body.appendChild(script);
        },0,readyToGo);

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
            CLOCKWORKCONFIG.engine = engineInstance;
            engineInstance.setAnimationEngine(animLib);
            manifest.dependencies.collisions.map(x=> HYPERGAP.LIBRARIES.getIncludedCollisions()[x]).filter(x=>x).forEach(engineInstance.registerCollision);
            manifest.dependencies.presets.map(x=> HYPERGAP.LIBRARIES.getIncludedPresets()[x]).filter(x=>x).forEach(engineInstance.loadPresets);
            engineInstance.loadPresets(HYPERGAP.presets.getPresets());

            manifest.levels.map(x=>"ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope + "/"+x).recursiveForEach(function (x,cb) {
                engineInstance.loadLevelsFromXML(x, cb);
            }, 0, function () {
                engineInstance.start(CLOCKWORKCONFIG.enginefps, document.getElementById("canvas"));
                var semaphorelength = 0;
                if (HYPERGAP.CONTROLLER.sendMessage) {
                    if (manifest.controllerAssets) {
                        semaphorelength = manifest.controllerAssets.spritesheets.length + manifest.controllerAssets.presets.length + manifest.controllerAssets.levels.length;
                        manifest.controllerAssets.spritesheets.map(x=>"ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope + "/"+x).forEach(function (x) {
                            loadFileText(x, function (text) {
                                HYPERGAP.CONTROLLER.sendMessageToNewControllers("RegisterSpritesheet~" + text);
                                semaphorelength--;
                                evalSemaphore();
                            });
                        });
                        manifest.controllerAssets.presets.map(x=>"ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope + "/" + x).forEach(function (x) {
                            loadFileText(x, function (text) {
                                HYPERGAP.CONTROLLER.sendMessageToNewControllers("RegisterPreset~" + text);
                                semaphorelength--;
                                evalSemaphore();
                            });
                        });
                        manifest.controllerAssets.levels.map(x=>"ms-appdata:///local/installedApps/" + manifest.name + "/" + manifest.scope + "/" + x).forEach(function (x) {
                            loadFileText(x, function (text) {
                                HYPERGAP.CONTROLLER.sendMessageToNewControllers("RegisterLevels~" + text);
                                semaphorelength--;
                                evalSemaphore();
                            });
                        });
                    }
                }
                evalSemaphore();
                function evalSemaphore() {
                    if (semaphorelength == 0) {
                        HYPERGAP.CONTROLLER.sendMessageToNewControllers("LoadLevel~" + (manifest.controller || "HyperGapMenu"));
                    }
                }
            });
        }


        function loadFileText(url, callback) {

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    callback(xmlhttp.responseText);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();

        }


    };
})();
