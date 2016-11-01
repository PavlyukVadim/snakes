export class Food {
	RADIUS = 6;
	x: number;
	y: number;
	color: string;
 
	constructor(maxX: number, maxY: number, THICNESS_WALL: number, ctxSnake: any, x : number, y : number, color : string) {
		this.x = (x % (maxX - 2 * (THICNESS_WALL + 5) ) + THICNESS_WALL + 5);
		this.y = (y % (maxY - 2 * (THICNESS_WALL + 5) ) + THICNESS_WALL + 5);
		this.color = color;
		this.draw(ctxSnake);
	}

	draw(ctx: any) {
		ctx.beginPath();
	    ctx.fillStyle = this.color;
	    ctx.arc(this.x, this.y, this.RADIUS, 0, 2 * Math.PI);
	    ctx.fill();
	    ctx.closePath();
	}

	destroy(ctx: any) {
		ctx.beginPath();
	    ctx.fillStyle = '#fff';
	    ctx.arc(this.x - 1, this.y - 1, this.RADIUS + 2, 0, 2 * Math.PI);
	    ctx.fill();
	    ctx.closePath();
	}
} 