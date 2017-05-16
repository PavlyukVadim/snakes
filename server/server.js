'use strict';

const User = require('./models/user').User;
global.api = {};
const snake = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket');
api.pathExists = require('path-exists');
api.qs = require('querystring');
api.email = require('./email');
api.async = require('async');
snake.food = require('./snakes/food');
snake.api = require('./snakes/snakeAPI');

let base = '/home/amadev/kpi/OKR/Snakes/client';
let index = api.fs.readFileSync('../client/index.html');
let server = api.http.createServer((req, res) => {
  let postReg = false;
  let mail = false;
  if (req.method === 'POST') {
    postReg = true;
    let body = '';
    req.on('data', (data) => {
      body += data;
      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        req.connection.destroy();
      }
    });

    req.on('end', () => {
      let post = api.qs.parse(body);
      if (post.name) {
        mail = true;
        api.email(post);
        res.writeHead(200);
        res.write('<h1>Message sent</h1>\n');
        res.end();
        return;
      }
      
      let userData = JSON.parse(body);
      if (userData.update) {
        api.async.waterfall([
          (callback) => {
            User.findOne({username: userData.login}, callback);
          },
            (user, callback) => {
            User.findOneAndUpdate({ username: userData.login },
                                  { gamePlayed: user.gamePlayed + 1 },
                                  { upsert: true },
                                  (err, doc) => {
                                    if (err) return res.send(500, { error: err });
                                    return res.end("succesfully saved");
                                  });
          }
        ], (err, user) => {
          if (err) return;
          res.writeHead(200);
          res.end(JSON.stringify(user));
        });
      }

      if (userData.login) {
        api.async.waterfall([
          (callback) => {
            User.findOne({username: userData.login}, callback);
          },
          (user, callback) => {
            if (user) {
              if (user.checkPassword(userData.password)) {
                callback(null, user);
              } else {
                res.writeHead(404);
                res.end('Wrong password');
              }
            } else {
              let user = new User({username: userData.login, password: userData.password });
              user.save((err) => {
                if (err) return;
                callback(null, user);
              })
            }
          }
        ], (err, user) => {
            if (err) return;
            res.writeHead(200);
            res.end(JSON.stringify(user));
          }
        );
        console.log('login: ' + userData.login);
        console.log('pass: ' + userData.password);
      }
    });
  }

  if(mail || postReg) return;
  let pathname = base + req.url;
  api.pathExists(pathname).then(exists => {
    if(!exists) {
      res.writeHead(404);
      res.write('Bad request 404\n');
      res.end();
    } else {
      res.statusCode = 200;
      if (req.url == '/') {
        pathname += 'index.html';
      }
      let file = api.fs.createReadStream(pathname);
      file.on('open', () => {
        file.pipe(res);
      });
      file.on('error', (err) => {
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
let snakesColor = [];
let userScore = [];

ws.on('request', (req) => {
  let connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  connection.send(JSON.stringify({
    type: 'initial_food',
    data: snake.food.arrayOfFood
  }));

  connection.on('message', (message) => {
    let dataName = message.type + 'Data';
    let data = message[dataName];
    let type = JSON.parse(data).type;
    if (type == 'destroy_food') {
      let dataObj = JSON.parse(data);
      for (let scoreElem of userScore) {
        if (scoreElem.name == dataObj.name) {
          scoreElem.score++;
          break;
        }
      }
      snake.api.sendUserScore(clients, userScore);
      snake.food.deleteFood(dataObj.x, dataObj.y);
    } else if (type == 'new_snake') {
      data = JSON.parse(data);
      snakesColor.push(data.color);
      addNewSnake(data, connection);
      snake.api.sendUserScore(clients, userScore);
      connection.name = data.name;
      data = JSON.stringify({
        type: 'new_snake',
        colors: snakesColor
      });
      snake.api.sendSnakeDataToEach(clients, data);
      return;
    } else if (type == 'destroy_snake') {
      data = JSON.parse(data);
      snakesColor.splice(snakesColor.indexOf(data.color), 1);
      userScore = userScore.filter((elem) => { if(elem.name != data.name) return elem;});
      snake.api.sendUserScore(clients, userScore);
      snake.api.sendSnakeDataToEach(clients, JSON.stringify({
        type: 'new_snake',
        colors: snakesColor
      }));
      data = JSON.stringify(data);
    }
    snake.api.sendSnakeData(clients, data, connection);
  });

  connection.on('close', (reasonCode, description) => {
    userScore = userScore.filter((elem) => {
      if(elem.name != connection.name) {
        return elem;
      }
    });
    snake.api.sendUserScore(clients, userScore);
    clients.splice(clients.indexOf(connection), 1);
    console.log('disconnected: ' + connection.remoteAddress);
  });
});

let addNewSnake = (data, connection) => {
  let result = userScore.reduce((count, elem) => {
    let initName = elem.name.split('').filter((s) => {
      if(s != '_') {
       return s; 
      }
    }).join('');
    if (initName == data.name) {
      count++;
    }
    return count;
  }, 0);
  if (result) {
    data.name = data.name + ('_').repeat(result);
    connection.send(JSON.stringify({
      type: 'change_name',
      name: data.name
    }));
  }
  userScore.push({
    name: data.name,
    color: data.color,
    score: 100
  });
}

snake.food.startGeneratingFood(clients);
