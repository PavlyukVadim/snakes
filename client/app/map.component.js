"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var snake_1 = require('./snake');
var food_1 = require('./food');
var snakes_control_1 = require('./snakes.control');
var THICNESS_WALL = 20;
var MapComponent = (function () {
    function MapComponent() {
        this.increaseScore = new core_1.EventEmitter();
        this.food = [];
        this.lose = false;
    }
    MapComponent.prototype.ngAfterViewInit = function () {
        this.ws = new WebSocket("ws://127.0.0.1:8081/");
        this.canvas = this.canvasRef.nativeElement;
        this.canvasFood = this.canvasFoodRef.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctxf = this.canvasFood.getContext('2d');
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        this.start();
    };
    MapComponent.prototype.start = function () {
        var _this = this;
        this.drawWall();
        this.snake = new snake_1.Snake(this.snakeColor, 100, 100, 2, 30, this.ctx, this.ws);
        this.snakeControl = new snakes_control_1.SnakesControl(this.ctx);
        this.snake.draw();
        this.snake.start({
            THICNESS_WALL: THICNESS_WALL,
            mapW: this.cWidth,
            mapH: this.cHeight
        });
        this.findCollisionsIntr = setInterval(function () {
            _this.findCollisions();
        }, 50);
        this.sendSnakeDataIntr = setInterval(function () {
            _this.ws.send(JSON.stringify({
                type: 'draw',
                x: _this.snake.x,
                y: _this.snake.y,
                COLOR: _this.snake.COLOR
            }));
        }, 50);
        this.ws.onmessage = function (event) {
            if (_this.lose)
                return;
            var change = JSON.parse(event.data);
            change.PIECE_SNAKE_RADIUS = change.PIECE_SNAKE_RADIUS || _this.snake.PIECE_SNAKE_RADIUS;
            if (change.type == 'initial_food') {
                change.data.forEach(function (element) {
                    _this.food.push(new food_1.Food(_this.cWidth, _this.cHeight, 20, _this.ctxf, element.x, element.y, element.color));
                });
            }
            else if (change.type == 'draw') {
                _this.snakeControl.drawAll(change);
            }
            else if (change.type == 'clean') {
                _this.snakeControl.clean(change);
            }
            else if (change.type == 'food') {
                _this.food.push(new food_1.Food(_this.cWidth, _this.cHeight, 20, _this.ctxf, change.x, change.y, change.color));
            }
            else if (change.type == 'destroy_food') {
                _this.snakeControl.destroyFood(_this.ctxf, change.x, change.y, change.PIECE_SNAKE_RADIUS + 3);
            }
            else if (change.type == 'destroy_snake') {
                _this.snakeControl.destroySnake(_this.ctx, change.coordinates, change.PIECE_SNAKE_RADIUS + 3);
            }
        };
        document.addEventListener('keydown', function (e) {
            if (e.which == 37) {
                _this.snake.turnLeft();
            }
            else if (e.which == 39) {
                _this.snake.turnRight();
            }
        });
    };
    MapComponent.prototype.drawWall = function () {
        this.ctxf.strokeStyle = "#f00";
        this.ctxf.setLineDash([5, 15]);
        this.ctxf.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL, this.cWidth - 2 * THICNESS_WALL, this.cHeight - 2 * THICNESS_WALL);
        this.ctxf.stroke();
    };
    MapComponent.prototype.findCollisions = function () {
        this.findFoodCollision();
        this.findSnakeСollision();
    };
    MapComponent.prototype.findFoodCollision = function () {
        for (var _i = 0, _a = this.food; _i < _a.length; _i++) {
            var part = _a[_i];
            if (this.snake.x > part.x - 10 && this.snake.x < part.x + 10 &&
                this.snake.y > part.y - 10 && this.snake.y < part.y + 10) {
                part.destroy(this.ctxf);
                this.food.splice(this.food.indexOf(part), 1);
                this.ws.send(JSON.stringify({
                    type: 'destroy_food',
                    x: part.x,
                    y: part.y
                }));
                this.snake.length += 1;
                this.increaseScore.emit(1);
            }
        }
    };
    MapComponent.prototype.findSnakeСollision = function () {
        var clipWidth = 10;
        var clipOffsetX = 12 * Math.cos(this.snake.convertDegInRad(this.snake.angle)), clipOffsetY = 12 * Math.sin(this.snake.convertDegInRad(this.snake.angle));
        var imageData = this.ctx.getImageData(-this.snake.PIECE_SNAKE_RADIUS + this.snake.x + clipOffsetX + 3 * Math.cos(this.snake.convertDegInRad(this.snake.angle)), -this.snake.PIECE_SNAKE_RADIUS + this.snake.y + clipOffsetY + 3 * Math.sin(this.snake.convertDegInRad(this.snake.angle)), clipWidth, clipWidth);
        for (var i = 0; i < clipWidth * clipWidth * 4; i += 4) {
            var r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16), g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16), b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
            var color = '#' + r + g + b;
            if (color == this.snake.COLOR) {
                //setTimeout(clearInterval, 300, this.snake.interval);
                this.gameOver();
                break;
            }
        }
    };
    MapComponent.prototype.gameOver = function () {
        clearInterval(this.snake.interval);
        clearInterval(this.sendSnakeDataIntr);
        clearInterval(this.findCollisionsIntr);
        this.lose = true;
        this.ws.send(JSON.stringify({
            type: 'destroy_snake',
            coordinates: this.snake.coordinates
        }));
        delete this.snake;
    };
    MapComponent.prototype.snakeLengthControl = function () {
        /*if (this.snake.coordinates.x.length >= this.snake.length) {
          this.ws.send(JSON.stringify({
                type : 'clean',
                x: this.snake.coordinates.x[0],
                y: this.snake.coordinates.y[0]
              }));
              this.snake.coordinates.x.shift();
          this.snake.coordinates.y.shift();
        }*/
    };
    __decorate([
        core_1.ViewChild('canvas'), 
        __metadata('design:type', core_1.ElementRef)
    ], MapComponent.prototype, "canvasRef", void 0);
    __decorate([
        core_1.ViewChild('canvasFood'), 
        __metadata('design:type', core_1.ElementRef)
    ], MapComponent.prototype, "canvasFoodRef", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "increaseScore", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MapComponent.prototype, "snakeColor", void 0);
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map',
            templateUrl: 'html/map.html'
        }), 
        __metadata('design:paramtypes', [])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map