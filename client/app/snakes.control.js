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
    return SnakesControl;
}());
exports.SnakesControl = SnakesControl;
//# sourceMappingURL=snakes.control.js.map