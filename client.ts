const WebSocket = require('ws');
import {Server} from 'ws';

const ws = new WebSocket('ws://localhost:8080/demo');
 
ws.on('open', function open() {
  ws.send('something');
});
 
ws.on('message', function incoming(data: any) {
  console.log(data);
});