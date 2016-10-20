export class Food {
	RADIUS = 6;
	x: number;
	y: number;
	color: string;
 
	constructor(maxX: number, maxY: number, THICNESS_WALL: number, ctxSnake: any) {
		let find: boolean = false;
		while(!find) {
			var n = 0;
			this.x = ((Math.random() * (maxX - THICNESS_WALL * 6)) + THICNESS_WALL * 3) >> 0;
			this.y = ((Math.random() * (maxY - THICNESS_WALL * 6)) + THICNESS_WALL * 3) >> 0;
			
			var clipWidth = 20, clipOffsetX = 20, clipOffsetY = 20;
	    var imageData = ctxSnake.getImageData(this.x - 10 + clipOffsetX, this.y - 10 + clipOffsetY, clipWidth, clipWidth);

	    for (let i = 0; i < clipWidth * clipWidth * 4; i += 4) {
	      let r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16),
	          g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16),
	          b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
	      let color: string = '#' + r + g + b; 

	      if (color == '#ff5050') {
	        n = 1;
	        break;
	      }
	  	}
	  	if (n == 0) 
	  		find = true;
		}

		this.color = `rgb(${Math.random() * 255 >> 0}, ${Math.random() * 255 >> 0}, ${Math.random() * 255 >> 0})`;
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