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
var THICNESS_WALL = 20;
var SnakeComponent = (function () {
    function SnakeComponent() {
    }
    SnakeComponent.prototype.ngOnInit = function () {
        console.log('onInit');
    };
    SnakeComponent.prototype.ngAfterViewInit = function () {
        this.canvas = this.canvasRef.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        console.log(this.canvas);
        this.start();
    };
    SnakeComponent.prototype.start = function () {
        this.drawWall();
        /*let iPosX: number = Math.random() * (mapW - 200) + 100;
      var iPosY = Math.random() * (mapH - 200) + 100;
      
      snake = new Snake(iPosX, iPosY, -90, INITIAL_LENGTH);
      snakeCoordinates = {
        x : [],
        y : []
      };

      drawWall();
      snake.draw();
      pushCoordinates();
      interval = setInterval(snake.running, 50);*/
    };
    SnakeComponent.prototype.drawWall = function () {
        this.ctx.strokeStyle = "#f00";
        this.ctx.setLineDash([5, 15]);
        this.ctx.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL, this.cWidth - 2 * THICNESS_WALL, this.cHeight - 2 * THICNESS_WALL);
        this.ctx.stroke();
    };
    __decorate([
        core_1.ViewChild('canvas'), 
        __metadata('design:type', core_1.ElementRef)
    ], SnakeComponent.prototype, "canvasRef", void 0);
    SnakeComponent = __decorate([
        core_1.Component({
            selector: 'map',
            templateUrl: 'html/map.html'
        }), 
        __metadata('design:paramtypes', [])
    ], SnakeComponent);
    return SnakeComponent;
}());
exports.SnakeComponent = SnakeComponent;
//# sourceMappingURL=snake.component.js.map