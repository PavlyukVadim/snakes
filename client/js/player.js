/*var INITIAL_LENGTH = 150,
    PIECE_SNAKE_RADIUS = 5,
    SPEED = 2,
    ROTATION_SPEED = 5,
    COLOR = '#ff5050',
    THICNESS_WALL = 20;*/


socket = new WebSocket('ws://127.0.0.1:8081/');
/*var canvas = document.getElementById('map'),
    ctx = canvas.getContext('2d');
var mapW = canvas.width,
    mapH = canvas.height;*/
var snake, 
    snakeCoordinates,
    interval;
var losing = false;
var countPressUp = 0;

/*var playBtn = document.getElementById('play'),
    jumbotron = document.getElementsByClassName('jumbotron')[0];
userColor = 'red';
*/
 
//playBtn.onclick = start;

/* Choose color */
$('.colors li div').bind('click', function() {
  userColor = this.id;
});

function sendSnakeData(event) {
  socket.send(JSON.stringify({
    x: snake.x,
    y: snake.y,
    angle: snake.angle,
    length: snake.length,
    color: userColor,
    snakeCoord : snakeCoordinates
  }));
}


/*function Snake(x, y, angle, length) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.length = length;
}*/
/*Snake.prototype.draw = function(){
  ctx.beginPath();
  ctx.fillStyle = COLOR;
  ctx.arc(this.x, this.y, PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};*/

/*Snake.prototype.running = function() {
  snake.x += SPEED * Math.cos(convertDegInRad(snake.angle));
  snake.y += SPEED * Math.sin(convertDegInRad(snake.angle));
  validationCoordinates();
  pushCoordinates();

  snake.draw();
}*/


/*function convertDegInRad(deg){
  return (deg * Math.PI) / 180;  
}*/

/*function start() {    
  //userName = inputText3.value || 'anonim';
  //jumbotron.style.display = 'none';

  //console.log(userName + ' ' + userColor);
  var iPosX = Math.random() * (mapW - 200) + 100;
  var iPosY = Math.random() * (mapH - 200) + 100;
  
  
  snake = new Snake(iPosX, iPosY, -90, INITIAL_LENGTH);
  snakeCoordinates = {
    x : [],
    y : []
  };

  //drawWall();
  snake.draw();
  pushCoordinates(); 
  interval = setInterval(snake.running, 50);
}*/

/*function finish() {
  clearInterval(interval);
  document.removeEventListener('keydown', snakeControl);
  alert("Finish");
}*/

/*function drawWall() {
  ctx.strokeStyle = "#f00";
  ctx.setLineDash([5, 15]);
  ctx.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL, mapW - 2 * THICNESS_WALL, mapH - 2 * THICNESS_WALL);
  ctx.stroke(); 
}*/

/*function pushCoordinates() {
  snakeCoordinates.x.push(snake.x);
  snakeCoordinates.y.push(snake.y);
  sendSnakeData();
  snakeLengthControl();
}*/

/*function snakeLengthControl() {
  if (snakeCoordinates.x.length > snake.length) {
    for (var i = 0; i < snakeCoordinates.x.length - snake.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = '#ff9';
      ctx.arc(snakeCoordinates.x[i], snakeCoordinates.y[i], PIECE_SNAKE_RADIUS + 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      snakeCoordinates.x.shift();
      snakeCoordinates.y.shift();
    }
  }
}*/

/*function validationCoordinates() {
  if(snake.x < THICNESS_WALL || snake.x > mapW - 2 * THICNESS_WALL || snake.y < THICNESS_WALL || snake.y > mapH - 2 * THICNESS_WALL) {
    finish();
  }
  checkСollision();
}*/

/*function checkСollision() {
  var clipWidth = 10;

  var clipOffsetX = 12 * Math.cos(convertDegInRad(snake.angle)),
      clipOffsetY = 12 * Math.sin(convertDegInRad(snake.angle));
  var imageData = ctx.getImageData(-PIECE_SNAKE_RADIUS + snake.x + clipOffsetX, -PIECE_SNAKE_RADIUS + snake.y + clipOffsetY, clipWidth, clipWidth);

  // Loop through the clip and see if you find red or blue. 
  for (var i = 0; i < clipWidth * clipWidth * 4; i += 4) {
    var r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16),
        g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16),
        b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
    var color = '#' + r + g + b; 

    if (color == COLOR) {
      if (!losing) {
        console.log(color);
        setTimeout(clearInterval, 300, interval); 
        losing = !losing;
        setTimeout(finish, 300);
      }
      break;
    }
  }
}*/ 

/*document.addEventListener('keydown', snakeControl);

function snakeControl(e) {
  if (e.keyCode == 37) {
    //snake.angle -= ROTATION_SPEED; 
    //SPEED = 2;
  }
  else if (e.keyCode == 39) {
    //snake.angle += ROTATION_SPEED;
    //SPEED = 2;
  }
  else if (e.keyCode == 38) {
    countPressUp++;
    if(!countPressUp % 4) {
      snake.length--; 
    }
    SPEED = 4;
  }
  else {
    SPEED = 2;
  }

 if(e.keyCode == 37 || e.keyCode == 39) {
  /*snake.x += SPEED * Math.cos(convertDegInRad(snake.angle));
  snake.y += SPEED * Math.sin(convertDegInRad(snake.angle));
  pushCoordinates();

  snake.draw();
  }  
}*/