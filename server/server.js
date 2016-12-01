'use strict';

const MAX_COUNT_FOOD = 20;

global.api = {};
api.fs = require('fs');
api.http = require('http');
api.websocket = require('websocket');
api.pathExists = require('path-exists');
api.qs = require('querystring');
api.nodemailer = require('nodemailer');
api.async = require('async');

var User = require('./models/user').User;


// create reusable transporter object using the default SMTP transport
var transporter = api.nodemailer.createTransport('smtps://pavlyuk.dev%40gmail.com:pv300108@smtp.gmail.com');

let base = '/home/amadev/kpi/OKL/Snakes/client';

let index = api.fs.readFileSync('../client/index.html');

let server = api.http.createServer((req, res) => {
  var postReg = false;
  var mail = false;
  if (req.method == 'POST') {
    postReg = true;
    var body = '';
    req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
        req.connection.destroy();
    });

    req.on('end', function () {
      var post = api.qs.parse(body);
      if (post.name) {
        mail = true;
        sendMail(post);
        res.writeHead(200);
        res.write('<h1>Message sent</h1>\n');
        res.end();
        return;
      }

      var userData = JSON.parse(body);

      if (userData.update) {
        console.log("aaaaaaaaaaa");

        api.async.waterfall([
          function (callback) {
            User.findOne({username: userData.login}, callback);
          },
          function (user, callback) {
            User.findOneAndUpdate({username: userData.login}, {gamePlayed: user.gamePlayed + 1}, {upsert:true}, function(err, doc){
              if (err) return res.send(500, { error: err });
              return res.end("succesfully saved");
            });
          }
        ],  function (err, user) {
          if (err) return;
          res.writeHead(200);
          res.end(JSON.stringify(user));
        }

        );
      }



      if (userData.login) {
        api.async.waterfall([
            function (callback) {
              User.findOne({username: userData.login}, callback);
            },
            function (user, callback) {
              if (user) {
                if (user.checkPassword(userData.password)) {
                  callback(null, user);
                } else {
                  res.writeHead(404);
                  res.end("Wrong password");
                }
              } else {
                var user = new User({username: userData.login, password: userData.password });
                user.save(function (err) {
                  if (err) return;
                  callback(null, user);
                })
              }
            }
        ],  function (err, user) {
              if (err) return;
              res.writeHead(200);
              res.end(JSON.stringify(user));
            }
        );
        console.log("login: " + userData.login);
        console.log("pass: " + userData.password);
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
let userScore = [];


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
  for (let scoreElem of userScore){
    if (scoreElem.name == dataObj.name) {
      scoreElem.score++;
    }
  }
  sendUserScore();
  deleteFood(dataObj.x, dataObj.y);
}

else if (type == 'new_snake') {
  data = JSON.parse(data);
  snakesColor.push(data.color);
  addNewSnake(data, connection);
  sendUserScore();
  connection.name = data.name;

  data = JSON.stringify({
    type: 'new_snake',
    colors: snakesColor
  })
  sendSnakeDataToEach(data);
  return;
}

else if (type == 'destroy_snake') {
  data = JSON.parse(data);
  snakesColor.splice(snakesColor.indexOf(data.color), 1);
  userScore = userScore.filter((elem) => { if(elem.name != data.name) return elem;});
  sendUserScore(data);
  sendSnakeDataToEach(JSON.stringify({
    type: 'new_snake',
    colors: snakesColor
  }));
  data = JSON.stringify(data);
}
sendSnakeData(data, connection);
});

connection.on('close', (reasonCode, description) => {
  userScore = userScore.filter((elem) => { if( elem.name != connection.name ) return elem;});
sendUserScore();
clients.splice(clients.indexOf(connection), 1);
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

function sendUserScore() {
  clients.forEach((client) => {
    let data = {};
  data.score = userScore;
  data.type = "user_score";
  client.send(JSON.stringify(data));
});
}


function addNewSnake(data, connection) {
  let result = userScore.reduce((count, elem) => {
        let initName = elem.name.split("").filter((s) => {if(s != '_') return s}).join("");
  if (initName == data.name) {
    count++;
  }
  return count;
}, 0);

  if (result) {
    data.name = data.name + ('_').repeat(result);
    connection.send(JSON.stringify({
      type: "change_name",
      name: data.name
    }));
  }
  userScore.push({
    name: data.name,
    color: data.color,
    score: 100
  })
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


function sendMail(data) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.email, // sender address
    to: 'pv0986536130@gmail.com', // list of receivers
    subject: 'Snakes ✔', // Subject line
    text: data.message + ' 🐴' // plaintext body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}