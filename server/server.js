'use strict';

global.api = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket'),
api.pathExists = require('path-exists');

let base = '/home/amadev/Рабочий стол/snakes/client';

let index = api.fs.readFileSync('../client/index.html');

let server = api.http.createServer((req, res) => {
  let pathname = base + req.url;
   
  api.pathExists(pathname).then(exists => {
    if(!exists) {
      res.writeHead(404);
      res.write('Bad request 404\n');
      res.end();
    }
    else {
      res.statusCode = 200;
      if (req.url == '/') pathname += 'index.html';

      let file = api.fs.createReadStream(pathname);
      file.on('open', function() {
        file.pipe(res);
      });
      file.on('error', function(err) {
        console.log(err);
      });
    }    
  });
});

server.listen(8081, () => {
  console.log('Listen port 8081');
});

let ws = new api.websocket.server({
  httpServer: server,
  autoAcceptConnections: false
});

let clients = [];

ws.on('request', (req) => {
  console.log('websocket');
  let connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  connection.on('message', (message) => {
    let dataName = message.type + 'Data',
        data = message[dataName];
    console.log('Received: ' + data);
    if(data.x) {
      sendSnakeData(data);
    }
    else {
      clients.forEach((client) => {
        client.send(data, connection);
      }); 
    }
  });
  connection.on('close', (reasonCode, description) => {
    console.log('Disconnected ' + connection.remoteAddress);
  });
});

function sendSnakeData(data, connection) {
  clients.forEach((client) => {
    if(client != connection) {
      client.send(data);  
    }
  });
}