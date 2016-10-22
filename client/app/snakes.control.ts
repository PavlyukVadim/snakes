export class SnakesControl {
	 
	ctx: any;

	constructor(ctx : any){
		this.ctx = ctx;
	}

	drawAll(snake: any) {
		this.ctx.beginPath();
		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.fillStyle = snake.COLOR;
		this.ctx.arc(snake.x, snake.y, snake.PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

}
