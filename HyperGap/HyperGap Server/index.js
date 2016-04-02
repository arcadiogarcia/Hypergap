var http = require('http');
var io = require('socket.io');

var server = http.createServer(function(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Ooops you shouldnt be here...');
});

var port=process.env.PORT||8080;
server.listen(port);
io = io.listen(server);
console.log("Listening in "+port);

io.sockets.on('connection', function(socket) {
    console.log("Client connected");
    socket.on('event', function(data) {
        console.log(data);
    });
    socket.on('disconnect', function() {
        console.log("Client disconnected");
    });
});
