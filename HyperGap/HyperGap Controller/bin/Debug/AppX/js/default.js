// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var serverip = null;
var brokenconnection = false;

var HYPERGAP = HYPERGAP || {};
HYPERGAP.CONTROLLER = {};
HYPERGAP.CONTROLLER.player = NaN;
HYPERGAP.presets=[];

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
			    document.getElementById("canvas").style.width = window.innerWidth;
			    document.getElementById("canvas").style.height = window.innerHeight;
			    document.getElementById("canvas").width = window.innerWidth;
			    document.getElementById("canvas").height = window.innerHeight;
			    setUpAnimation(setUpEngine);
			    //init(); TODO:UNCOMMENT THIS
			} else {
				// TODO: This application was suspended and then terminated.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
			}
			args.setPromise(WinJS.UI.processAll());
		}
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();
})();


function init() {
    var datagramSocket = new Windows.Networking.Sockets.DatagramSocket();
    datagramSocket.onmessagereceived = function (e, data) {
        //var rawString = e.getDataReader().readString(15);
        //while (rawString.indexOf("$") != -1) {
        //    rawString = rawString.replace("$", "");
        //}
        if (!serverip) {
            serverip = e.remoteAddress;
            createDataSocket(e.remoteAddress);
        }
    };
    datagramSocket.bindEndpointAsync(null, "8775").done(function () {
        datagramSocket.joinMulticastGroup(new Windows.Networking.HostName("224.0.0.1"));
    }, function (e) {
        console.log(e);
    }, function (e) {
        console.log(e);
    });
}

var tcpSocket
var tcpReader;



function createDataSocket(hostname) {
    tcpSocket = new Windows.Networking.Sockets.StreamSocket();
    tcpSocket.connectAsync(hostname, "8776").done(function () {
        tcpReader = new Windows.Storage.Streams.DataReader(tcpSocket.inputStream);
        startServerRead();
        var writer = new Windows.Storage.Streams.DataWriter(tcpSocket.outputStream);
        HYPERGAP.CONTROLLER.sendMessage = function (message) {
            writer.writeInt32(writer.measureString(message));
            writer.writeString(message);
            writer.storeAsync();
        };
        //HYPERGAP.CONTROLLER.sendMessage("hello from client");
    }, function (e) {
        brokenconnection = true;
        console.log(e);
    });
}

setInterval(function () {
    if (brokenconnection) {
        createDataSocket(serverip);
        brokenconnection=false;
    }
}, 1000);

function startServerRead() {
    tcpReader.loadAsync(4).done(function (sizeBytesRead) {
        // Make sure 4 bytes were read.
        if (sizeBytesRead !== 4) {
            //Connection lost
            brokenconnection = true;
            return;
        }

        // Read in the 4 bytes count and then read in that many bytes.
        var count = tcpReader.readInt32();
        return tcpReader.loadAsync(count).then(function (stringBytesRead) {
            // Make sure the whole string was read.
            if (stringBytesRead !== count) {
                //Connection lost
                return;
            }
            // Read in the string.
            var string = tcpReader.readString(count);
            
            if (HYPERGAP.CONTROLLER.onMessage) {
                HYPERGAP.CONTROLLER.onMessage(string);
            }
            // Restart the read for more bytes.
            startServerRead();
        }); // End of "read in rest of string" function.
    }, onError);
}

function onError(e) {
    brokenconnection = true;
    console.log(e);
}

HYPERGAP.CONTROLLER.onMessage = function (rawMessage) {
    var message=rawMessage.split("%");
    switch (message[0]) {
        case "SetPlayer":
            HYPERGAP.CONTROLLER.player = parseInt(message[1]);
            break;
        case "LoadLevel":
            console.log("opening level")
            engineInstance.loadLevelByID(message[1]);
            break;
        case "ClockworkEvent":
            engineInstance.execute_event(message[1], message[2]);
            engineInstance.loadLevelByID(message[1]);
            break;
        case "PlayerJoined":
            if (message[1] == tempid) {
                HYPERGAP.CONTROLLER.player = message[2];
                engineInstance.loadLevelByID("HyperGapMenu");
            }
            break;
        case "PrivateCommand":
            if (message[1] == HYPERGAP.CONTROLLER.player) {
                message.shift();
                message.shift();
                HYPERGAP.CONTROLLER.onMessage(message.join("%"));
            }
            break;
        case "RegisterSpritesheet":
            var blob = new Blob([message[1]], { type: "text/xml" });
            engineInstance.getAnimationEngine().asyncLoad(URL.createObjectURL(blob), function () { });
            break;
        case "RegisterPreset":
            var blob = new Blob([message[1]], { type: "text/plain" });
            eval(message[1]); //DONT JUDGE ME
            engineInstance.loadPresets(HYPERGAP.presets, function () { });
            break;
        case "RegisterLevels":
            var blob = new Blob([message[1]], { type: "text/xml" });
            console.log("loading levels")
            engineInstance.loadLevelsFromXML(URL.createObjectURL(blob), function () {console.log("loaded levels") });
            break;
        case "Bye":
            if (message[1] == "LoadPage" && tcpSocket) {
                tcpSocket.close();
                brokenconnection = true;
            }
            break;
    }
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
    canvasAnimation.asyncLoad("game/data/spritesheets.xml", (function (c) { return function () { callback(c) }; })(canvasAnimation));
}
var engineInstance;

function setUpEngine(animLib) {
    engineInstance = new Clockwork();
    engineInstance.setAnimationEngine(animLib);
    engineInstance.registerCollision(ClockworkCollisions.pointsAndBoxes);
    engineInstance.loadPresets(game_presets);
    engineInstance.loadPresets(keyboard);
    engineInstance.loadPresets(pointerAPI);
    engineInstance.loadPresets(sound);
    engineInstance.loadPresets(W10API);
    engineInstance.loadPresets(basicClickPreset);
    engineInstance.loadPresets(storage);

    engineInstance.loadLevelsFromXML("game/data/levels.xml", function () {
        engineInstance.start(CLOCKWORKCONFIG.enginefps, document.getElementById("canvas"));
        startSockets();
    });
}

var tempid;

function startSockets() {
    var socket = io("http://slushasaservice.azurewebsites.net");


    socket.on('event', function (data) {
        console.log(data.payload);
        HYPERGAP.CONTROLLER.onMessage(data.payload);
    });

    HYPERGAP.CONTROLLER.sendMessage = function (data) {
        socket.emit('event', { payload: data, action: "start", player: HYPERGAP.CONTROLLER.player });
    }

    tempid = Math.random();

    HYPERGAP.CONTROLLER.sendMessage("RegisterPlayer%" + tempid);
}