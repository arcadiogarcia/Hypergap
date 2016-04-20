var HYPERGAP = HYPERGAP || {};
HYPERGAP.CONTROLLER = {};

var nPlayers = 0;
if(localStorage.maxPlayers){
    nPlayers = parseInt(localStorage.maxPlayers);
}

HYPERGAP.CONTROLLER.onMessage = function (message,player) {
    if (message.indexOf("RegisterPlayer%") == 0) {
        var tempid = message.split("%")[1];
        HYPERGAP.CONTROLLER.sendMessage("PlayerJoined%" + tempid + "%" + nPlayers);
        messagesForNewControllers.map(function (x) { return "PrivateCommand%" + nPlayers + "%" + x; }).forEach(HYPERGAP.CONTROLLER.sendMessage);
        nPlayers++;
        localStorage.maxPlayers = nPlayers;
    }
    if (message.indexOf("MenuClick%") == 0) {
        var id = message.split("%")[1];
        if (HYPERGAP.MENU) {
            HYPERGAP.MENU.invoke(id);
        }
    }
    if (message.indexOf("ClockworkEvent%") == 0) {
        var partsmessage = message.split("%");
        CLOCKWORKCONFIG.engine.execute_event(partsmessage[1], partsmessage[2]);
    }
    switch (message) {
        case "startSplash":
            if (HYPERGAP.SPLASH) {
                HYPERGAP.SPLASH.click();
            }
            break;
        case "right":
            if (window.CLOCKWORKCONFIG && window.CLOCKWORKCONFIG.engine) {
                CLOCKWORKCONFIG.engine.execute_event("keyboard_down", { key: 37,player:player });
            }
            break;
        case "left":
            if (window.CLOCKWORKCONFIG && window.CLOCKWORKCONFIG.engine) {
                CLOCKWORKCONFIG.engine.execute_event("keyboard_down", { key: 39,player:player });
            }
            break;
        case "up":
            if (window.CLOCKWORKCONFIG && window.CLOCKWORKCONFIG.engine) {
                CLOCKWORKCONFIG.engine.execute_event("keyboard_down", { key: 38,player:player });
            }
            break;
        case "down":
            if (window.CLOCKWORKCONFIG && window.CLOCKWORKCONFIG.engine) {
                CLOCKWORKCONFIG.engine.execute_event("keyboard_down", { key: 40, player: player });
            }
            break;
        case "a-button":
            if (window.CLOCKWORKCONFIG && window.CLOCKWORKCONFIG.engine) {
                CLOCKWORKCONFIG.engine.execute_event("keyboard_down", { key: 65,player:player });
            }
            break;
        case "b-button":
            if (window.CLOCKWORKCONFIG && window.CLOCKWORKCONFIG.engine) {
                CLOCKWORKCONFIG.engine.execute_event("keyboard_down", { key: 66, player: player });
            }
            break;
    }
    console.log(message);
}


var datagramSocket = new Windows.Networking.Sockets.DatagramSocket();
datagramSocket.onmessagereceived = function (e, data) {
    var rawString = e.getDataReader().readString(15);
    while (rawString.indexOf("$") != -1) {
        rawString = rawString.replace("$", "");
    }
    console.log("Just received ", rawString);
};
var connectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
if (connectionProfile) {
    datagramSocket.bindServiceNameAsync("8775", connectionProfile.networkAdapter).done(function () {
        datagramSocket.joinMulticastGroup(new Windows.Networking.HostName("224.0.0.1"));
        datagramSocket.getOutputStreamAsync(new Windows.Networking.HostName("224.0.0.1"), "8775").done(function (stream) {
            var myIP = Windows.Networking.Connectivity.NetworkInformation.getHostNames().filter(x=>x.type == 1).map(x=>x.rawName)[0];
            while (myIP.length < 15) {
                myIP += "$";
            }
            stream.writeAsync(Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(myIP, Windows.Security.Cryptography.BinaryStringEncoding.utf8));
        });
    }, function (e) {
        console.log(e);
    }, function (e) {
        console.log(e);
    });
}

//var tcpSocket = new Windows.Networking.Sockets.StreamSocket();
//tcpSocket.bindServiceNameAsync("8779").done(function (e) {
//    tcpSocket.onconnectionreceived = function () {

//    };
//});
//tcpSocket.clientSocket.connectAsync(new Windows.Networking.HostName(ip), "8779").done(function () {
//    var writer = new Windows.Storage.Streams.DataWriter(tcpSocket);
//    writer.writeString("hello from client");
//});



//TODO: UNCOMMENT THIS
var tcpListener = new Windows.Networking.Sockets.StreamSocketListener(8779);
var tcpReader, tcpSocket;
tcpListener.control.qualityOfService = Windows.Networking.Sockets.SocketQualityOfService.lowLatency; //Does this improve anything?
tcpListener.onconnectionreceived=onServerAccept;
tcpListener.bindServiceNameAsync("8776", Windows.Networking.Sockets.SocketProtectionLevel.plainSocket).done(function (e) {
    console.log("Bind successful");
}, onError);

// This has to be a real function ; it will "loop" back on itself with the
// call to acceptAsync at the very end.
function onServerAccept(eventArgument) {
    tcpSocket = eventArgument.socket;
    var writer = new Windows.Storage.Streams.DataWriter(tcpSocket.outputStream);
    HYPERGAP.CONTROLLER.sendMessage = function (message) {
        console.log(message);
        message=JSON.stringify({ payload: message, action: "start" });
        writer.writeInt32(writer.measureString(message));
        writer.writeString(message);
        writer.storeAsync();
    };
    HYPERGAP.CONTROLLER.sendMessage("SetPlayer%"+(nPlayers++));
    HYPERGAP.CONTROLLER.sendMessage("LoadLevel%HyperGapMenu");
    tcpReader= new Windows.Storage.Streams.DataReader(tcpSocket.inputStream);
    startServerRead();
}

// The protocol here is simple: a four-byte 'network byte order' (big-endian) integer
// that says how long a string is, and then a string that is that long.
// We wait for exactly 4 bytes, read in the count value, and then wait for
// count bytes, and then display them.
function startServerRead() {
    tcpReader.loadAsync(4).done(function (sizeBytesRead) {
        // Make sure 4 bytes were read.
        if (sizeBytesRead !== 4) {
            //Connection lost
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
            console.log("Server read: " + string);
            if (HYPERGAP.CONTROLLER.onMessage) {
                var data = JSON.parse(string);
                HYPERGAP.CONTROLLER.onMessage(data.payload || "", data.player);
            }
            //HYPERGAP.CONTROLLER.sendMessage("Server received: " + string);
            // Restart the read for more bytes.
            startServerRead();
        }); // End of "read in rest of string" function.
    }, onError);
}

function onError(e) {
    console.log(e);
}


HYPERGAP.CONTROLLER.close = function () {
    if (tcpListener) {
        if(HYPERGAP.CONTROLLER.sendMessage){
            HYPERGAP.CONTROLLER.sendMessage("Bye%LoadPage");
        }
        tcpListener.close();
    }
}



//var bluetoothQuery = Windows.Devices.Bluetooth.Rfcomm.RfcommDeviceService.getDeviceSelector(Windows.Devices.Bluetooth.Rfcomm.RfcommServiceId.obexObjectPush);
//Windows.Devices.Enumeration.DeviceInformation.findAllAsync(bluetoothQuery, null).done(function (x) {
//    console.log(x);
//});
//Windows.Devices.Bluetooth.Rfcomm.RfcommServiceProvider.createAsync(Windows.Devices.Bluetooth.Rfcomm.RfcommServiceId.obexObjectPush).done(function(result){
//    var listener = new Windows.Networking.Sockets.StreamSocketListener();
//    listener.onconnectionreceived = function(listener, args){
//        console.log("hey");
//    }
//    listener.bindServiceNameAsync(result.serviceId.asString(), Windows.Networking.Sockets.SocketProtectionLevel.bluetoothEncryptionAllowNullAuthentication);
//    InitializeServiceSdpAttributes(result);
//    result.startAdvertising();
//});

//var SERVICE_VERSION_ATTRIBUTE_ID = 0x0300;
//var SERVICE_VERSION_ATTRIBUTE_TYPE = 0x0A;   // UINT32
//var SERVICE_VERSION = 200;

//function InitializeServiceSdpAttributes(conn) {
//    var writer = new Windows.Storage.Streams.DataWriter();

//    // First write the attribute type
//    writer.WriteByte(SERVICE_VERSION_ATTRIBUTE_TYPE)
//    // Then write the data
//    writer.WriteUint32(SERVICE_VERSION);

//    var data = writer.DetachBuffer();
//    conn.SdpRawAttributes.Add(SERVICE_VERSION_ATTRIBUTE_ID, data);
//}


//var socket = io("http://slushasaservice.azurewebsites.net");


//socket.on('event', function (data) {
//    console.log(data.player)
//    HYPERGAP.CONTROLLER.onMessage(data.payload||"",data.player);
//});



//HYPERGAP.CONTROLLER.sendMessage = function (data) {
//    socket.emit('event', { payload: data ,action:"start"});
//}

var messagesForNewControllers = [];

HYPERGAP.CONTROLLER.sendMessageToNewControllers = function (data) {
    messagesForNewControllers.push(data);
    if (HYPERGAP.CONTROLLER.sendMessage) {
        HYPERGAP.CONTROLLER.sendMessage(data);
    }
}
