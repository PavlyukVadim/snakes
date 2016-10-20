"use strict";
var Snake = (function () {
    function Snake(x, y, angle, length, ctx) {
        this.INITIAL_LENGTH = 150;
        this.PIECE_SNAKE_RADIUS = 5;
        this.SPEED = 2;
        this.ROTATION_SPEED = 5;
        this.COLOR = '#ff5050';
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        this.ctx = ctx;
        this.coordinates = {
            x: [],
            y: []
        };
    }
    Snake.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = this.COLOR;
        this.ctx.arc(this.x, this.y, this.PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    };
    Snake.prototype.start = function (canvasSetting) {
        this.interval = setInterval(this.running, 50, canvasSetting, this);
    };
    Snake.prototype.running = function (cSetting, that) {
        var radian = (that.angle * Math.PI) / 180;
        that.x += that.SPEED * Math.cos(radian);
        that.y += that.SPEED * Math.sin(radian);
        that.validationCoordinates(cSetting);
        that.pushCoordinates();
        that.draw();
    };
    Snake.prototype.pushCoordinates = function () {
        this.coordinates.x.push(this.x);
        this.coordinates.y.push(this.y);
        this.snakeLengthControl();
    };
    Snake.prototype.snakeLengthControl = function () {
        if (this.coordinates.x.length > this.length) {
            for (var i = 0; i < this.coordinates.x.length - this.length; i++) {
                this.ctx.beginPath();
                this.ctx.clearRect(this.coordinates.x[i] - this.PIECE_SNAKE_RADIUS - 2, this.coordinates.y[i] - this.PIECE_SNAKE_RADIUS - 2, this.PIECE_SNAKE_RADIUS * 2 + 3, this.PIECE_SNAKE_RADIUS * 2 + 3);
                this.ctx.closePath();
                this.coordinates.x.shift();
                this.coordinates.y.shift();
            }
        }
    };
    Snake.prototype.convertDegInRad = function (angle) {
        return (angle * Math.PI) / 180;
    };
    Snake.prototype.validationCoordinates = function (cSetting) {
        if (this.x < cSetting.THICNESS_WALL || this.x > cSetting.mapW - cSetting.THICNESS_WALL ||
            this.y < cSetting.THICNESS_WALL || this.y > cSetting.mapH - cSetting.THICNESS_WALL) {
            //finish();
            this.stop();
        }
        this.checkСollision();
    };
    Snake.prototype.checkСollision = function (food) {
        if (food === void 0) { food = []; }
        var clipWidth = 10;
        var clipOffsetX = 12 * Math.cos(this.convertDegInRad(this.angle)), clipOffsetY = 12 * Math.sin(this.convertDegInRad(this.angle));
        var imageData = this.ctx.getImageData(-this.PIECE_SNAKE_RADIUS + this.x + clipOffsetX, -this.PIECE_SNAKE_RADIUS + this.y + clipOffsetY, clipWidth, clipWidth);
        // Loop through the clip and see if you find red or blue. 
        for (var i = 0; i < clipWidth * clipWidth * 4; i += 4) {
            var r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16), g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16), b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
            var color = '#' + r + g + b;
            if (color == this.COLOR) {
                //if (!losing) {
                setTimeout(clearInterval, 250, this.interval);
                //losing = !losing;
                //setTimeout(finish, 300);
                //}
                break;
            }
            else if (color != '#000000' && food.len) {
            }
        }
    };
    Snake.prototype.turnLeft = function () {
        this.angle -= this.ROTATION_SPEED;
        this.move();
    };
    Snake.prototype.turnRight = function () {
        this.angle += this.ROTATION_SPEED;
        this.move();
    };
    Snake.prototype.move = function () {
        this.x += this.SPEED * Math.cos(this.convertDegInRad(this.angle));
        this.y += this.SPEED * Math.sin(this.convertDegInRad(this.angle));
        this.pushCoordinates();
        this.draw();
    };
    Snake.prototype.stop = function () {
        clearInterval(this.interval);
        //document.removeEventListener('keydown', snakeControl);
        alert("Finish");
    };
    return Snake;
}());
exports.Snake = Snake;
//# sourceMappingURL=snake.js.map