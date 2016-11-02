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
let food = [];


ws.on('request', (req) => {
  console.log('websocket');
  let connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  
  connection.send(JSON.stringify({
    type: 'initial_food',
    data: food
  }));


  connection.on('message', (message) => {
    let dataName = message.type + 'Data',
        data = message[dataName];
        
        if (JSON.parse(data).type == 'destroy_food') {
          let dataObj = JSON.parse(data);
          deleteFood(dataObj.x, dataObj.y);
        }

      sendSnakeData(data, connection);
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


/*Create food*/

setInterval(() => {
  let data = {
    type : 'food',
    x : (Math.random() * 1000),
    y : (Math.random() * 1000),
    color : `rgb(${Math.random() * 255 >> 0}, ${Math.random() * 255 >> 0}, ${Math.random() * 255 >> 0})`
  };

  food.push(data);

  clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
}, 3000); 


function deleteFood(x, y) {
  food.forEach((element) => {
    if ( (element.x % (700 - 2 * (20 + 5) ) + 20 + 5) == x &&
         (element.y % (500 - 2 * (20 + 5) ) + 20 + 5) == y) {
      food.splice(food.indexOf(element), 1);
      return;
    }
  });
}

