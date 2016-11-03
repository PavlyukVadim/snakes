'use strict';

const MAX_COUNT_FOOD = 20; 

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
let snakesColor = [];



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
        let type = JSON.parse(data).type; 
        
        if (type == 'destroy_food') {
          let dataObj = JSON.parse(data);
          deleteFood(dataObj.x, dataObj.y);
        }

        else if (type == 'new_snake') {
          snakesColor.push(JSON.parse(data).color);
          data = JSON.stringify({
            type: 'new_snake',
            colors: snakesColor
          })
          sendSnakeDataToEach(data);
          return;
        }

        else if (type == 'destroy_snake') {
          snakesColor.splice(snakesColor.indexOf(JSON.parse(data).color), 1);
          sendSnakeDataToEach(JSON.stringify({
            type: 'new_snake',
            colors: snakesColor
          }));
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

function sendSnakeDataToEach(data) {
  clients.forEach((client) => {
    client.send(data);  
  });
}



/*Create food*/

setInterval(() => {
  if (food.length > MAX_COUNT_FOOD) return;
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

