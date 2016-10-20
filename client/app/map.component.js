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
var THICNESS_WALL = 20;
var MapComponent = (function () {
    function MapComponent() {
        this.increaseScore = new core_1.EventEmitter();
        this.food = [];
    }
    MapComponent.prototype.ngAfterViewInit = function () {
        var ws = new WebSocket("ws://127.0.0.1:8081/");
        setInterval(function () {
            ws.send(JSON.stringify({
                x: 10,
                y: 10,
                angle: 20,
                length: 50,
                color: 65,
                snakeCoord: 54
            }));
        }, 1000);
        this.canvas = this.canvasRef.nativeElement;
        this.canvasFood = this.canvasFoodRef.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctxf = this.canvasFood.getContext('2d');
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        this.start();
    };
    MapComponent.prototype.start = function () {
        this.drawWall();
        var snake = new snake_1.Snake(100, 100, 2, 150, this.ctx);
        setInterval(function (that) {
            that.food.push(new food_1.Food(that.cWidth, that.cHeight, 20, that.ctx));
            that.food[that.food.length - 1].draw(that.ctxf);
        }, 1000, this);
        setInterval(function (that, snake) {
            that.findFoodCollision(snake);
        }, 40, this, snake);
        snake.draw();
        snake.start({
            THICNESS_WALL: THICNESS_WALL,
            mapW: this.cWidth,
            mapH: this.cHeight
        });
        document.addEventListener('keydown', function snakeControl(e) {
            if (e.which == 37) {
                snake.turnLeft();
            }
            else if (e.which == 39) {
                snake.turnRight();
            }
        });
    };
    MapComponent.prototype.findFoodCollision = function (snake) {
        for (var _i = 0, _a = this.food; _i < _a.length; _i++) {
            var part = _a[_i];
            if (snake.x > part.x - 10 && snake.x < part.x + 10 &&
                snake.y > part.y - 10 && snake.y < part.y + 10) {
                part.destroy(this.ctxf);
                this.food.splice(this.food.indexOf(part), 1);
                snake.length += 0.2;
                this.increaseScore.emit(1);
            }
        }
    };
    MapComponent.prototype.drawWall = function () {
        this.ctx.strokeStyle = "#f00";
        this.ctx.setLineDash([5, 15]);
        this.ctx.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL, this.cWidth - 2 * THICNESS_WALL, this.cHeight - 2 * THICNESS_WALL);
        this.ctx.stroke();
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
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map',
            templateUrl: 'html/map.html',
        }), 
        __metadata('design:paramtypes', [])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map