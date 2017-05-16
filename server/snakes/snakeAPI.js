let sendSnakeData = (clients, data, connection) => {
  clients.forEach((client) => {
    if(client != connection) {
      client.send(data);
    }
  });
}

let sendSnakeDataToEach = (clients, data) => {
  clients.forEach((client) => {
    client.send(data);
  });
}

let sendUserScore = (clients, usersScore) => {
  clients.forEach((client) => {
    let data = {};
    data.score = usersScore;
    data.type = 'user_score';
    client.send(JSON.stringify(data));
  });
}

module.exports.sendSnakeData = sendSnakeData;
module.exports.sendSnakeDataToEach = sendSnakeDataToEach;
module.exports.sendUserScore = sendUserScore;
