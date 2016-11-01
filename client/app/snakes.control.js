"use strict";
var SnakesControl = (function () {
    function SnakesControl(ctx) {
        this.ctx = ctx;
    }
    SnakesControl.prototype.drawAll = function (snake) {
        this.ctx.beginPath();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = snake.COLOR;
        this.ctx.arc(snake.x, snake.y, snake.PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    };
    SnakesControl.prototype.clean = function (snake) {
        this.ctx.beginPath();
        this.ctx.clearRect(snake.x - snake.PIECE_SNAKE_RADIUS - 2, snake.y - snake.PIECE_SNAKE_RADIUS - 2, snake.PIECE_SNAKE_RADIUS * 2 + 3, snake.PIECE_SNAKE_RADIUS * 2 + 3);
        this.ctx.closePath();
    };
    SnakesControl.prototype.destroyFood = function (ctx, x, y, RADIUS) {
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(x - 1, y - 1, RADIUS + 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
    return SnakesControl;
}());
exports.SnakesControl = SnakesControl;
//# sourceMappingURL=snakes.control.js.map