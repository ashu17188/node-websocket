#!/usr/bin/env node
import * as WebSocket from 'ws';
import { createServer } from 'http';

//const fs = require('fs');
//const https = require('https');
 
let server  = createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
    res.writeHead(404);
    res.end();
});

/// const server = https.createServer({
//   cert: fs.readFileSync('/path/to/cert.pem'),
//   key: fs.readFileSync('/path/to/key.pem')
// });

let wss:WebSocket.Server = new WebSocket.Server({ server });
 
wss.on('connection', (request:any) => {
  request.on('message', function incoming(message:any) {
    console.log('received: %s', message);
  });
 
  request.send('something');
});
 
server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});
