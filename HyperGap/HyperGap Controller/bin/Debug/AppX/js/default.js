// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
			    init();
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
        var rawString = e.getDataReader().readString(15);
        while (rawString.indexOf("$") != -1) {
            rawString = rawString.replace("$", "");
        }
        document.body.innerHTML+="Hey";
        document.body.innerHTML += "Started";
        document.body.innerHTML += ("Just received " + rawString);
        document.body.innerHTML += (rawString);
        createDataSocket(e.remoteAddress);
    };
    datagramSocket.bindEndpointAsync(null, "8776").done(function () {
        datagramSocket.joinMulticastGroup(new Windows.Networking.HostName("224.0.0.1"));
    }, function (e) {
        console.log(e);
    }, function (e) {
        console.log(e);
    });
}

function createDataSocket(hostname) {
    var tcpSocket = new Windows.Networking.Sockets.StreamSocket();
    document.body.innerHTML += ("connecting to " + hostname);
    tcpSocket.connectAsync(hostname, "8777").done(function () {
        document.body.innerHTML += ("connected to " + hostname);
        var writer = new Windows.Storage.Streams.DataWriter(tcpSocket);
        writer.writeInt32(writer.measureString("hello from client"));
        writer.writeString("hello from client");
    }, function (e) { document.body.innerHTML += (e); });
}