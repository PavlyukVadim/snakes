"use strict";
var Food = (function () {
    function Food(maxX, maxY, THICNESS_WALL, ctxSnake, x, y, color) {
        this.RADIUS = 6;
        this.x = (x % (maxX - 2 * (THICNESS_WALL + 5)) + THICNESS_WALL + 5);
        this.y = (y % (maxY - 2 * (THICNESS_WALL + 5)) + THICNESS_WALL + 5);
        this.color = color;
        this.draw(ctxSnake);
    }
    Food.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
    Food.prototype.destroy = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(this.x - 1, this.y - 1, this.RADIUS + 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
    return Food;
}());
exports.Food = Food;
//# sourceMappingURL=food.js.map