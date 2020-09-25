#!/usr/bin/env node
import * as websocket from 'websocket';
import { createServer } from 'http';

let WebSocketServer = websocket.server;

let server = createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
    res.writeHead(404);
    res.end();
});

server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});

let wsServer: websocket.server = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}


wsServer.on('request', (request) => {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', (message: websocket.IMessage) => {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data as websocket.IStringified);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData?.byteLength + ' bytes');
            connection.sendBytes(message.binaryData as Buffer);
        }
    });
    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});