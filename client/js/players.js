function drawAllSnakes(data) {
  ctx.beginPath();
  ctx.fillStyle = data.color;
  ctx.arc(data.x, data.y, PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  snakesLengthControl(data.snakeCoord, data.length);
}

function snakesLengthControl(coord, length) {
  if (coord.x.length >= length) {
    for (var i = 0; i < coord.x.length - snake.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = '#ff9';
      ctx.arc(coord.x[i], coord.y[i], PIECE_SNAKE_RADIUS + 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }
}