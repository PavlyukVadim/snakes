"use strict";
var SnakesControl = (function () {
    function SnakesControl(ctx) {
        this.prevCoordinates = [];
        this.ctx = ctx;
    }
    SnakesControl.prototype.drawAll = function (snake) {
        var prevCoordinate = this.getPrevCoordinate(snake.name);
        if (prevCoordinate !== false) {
            var x = prevCoordinate.x;
            var y = prevCoordinate.y;
            console.log(x + " " + y);
            if (Math.abs(x - snake.x) > 10 || Math.abs(y - snake.y) > 10) {
                this.setPrevCoordinate(snake.name, snake.x, snake.y);
                return;
            }
            // butt line cap (top line)
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(snake.x, snake.y);
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = snake.COLOR;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = "round";
            this.ctx.stroke();
            this.setPrevCoordinate(snake.name, snake.x, snake.y);
            return;
        }
        /*this.ctx.beginPath();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = snake.COLOR;
        this.ctx.arc(snake.x, snake.y, snake.PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();*/
        this.setPrevCoordinate(snake.name, snake.x, snake.y);
    };
    SnakesControl.prototype.getPrevCoordinate = function (name) {
        var prevElem = false;
        this.prevCoordinates.forEach(function (elem) {
            if (elem.name == name) {
                prevElem = elem;
            }
        });
        return prevElem;
    };
    SnakesControl.prototype.setPrevCoordinate = function (currName, currX, currY) {
        var prevElem = false;
        this.prevCoordinates.forEach(function (elem) {
            if (elem.name == currName) {
                prevElem = elem;
            }
        });
        if (!prevElem) {
            this.prevCoordinates.push({ name: currName, x: currY, y: currY });
        }
        else {
            prevElem.x = currX;
            prevElem.y = currY;
        }
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
    SnakesControl.prototype.destroySnake = function (ctx, coordinates, RADIUS) {
        for (var i = 0; i < coordinates.x.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.arc(coordinates.x[i] - 1, coordinates.y[i] - 1, RADIUS + 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    };
    return SnakesControl;
}());
exports.SnakesControl = SnakesControl;
//# sourceMappingURL=snakes.control.js.map