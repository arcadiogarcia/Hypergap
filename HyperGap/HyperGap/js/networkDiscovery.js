var datagramSocket = new Windows.Networking.Sockets.DatagramSocket();
datagramSocket.onmessagereceived = function (e, data) {
    var rawString = e.getDataReader().readString(15);
    while (rawString.indexOf("$")!=-1) {
        rawString=rawString.replace("$", "");
    }
    console.log("Just received ",rawString);
};
datagramSocket.bindEndpointAsync(null, "8778").done(function () {
    datagramSocket.joinMulticastGroup(new Windows.Networking.HostName("224.0.0.1"));
    datagramSocket.getOutputStreamAsync(new Windows.Networking.HostName("224.0.0.1"), "8778").done(function (stream) {
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