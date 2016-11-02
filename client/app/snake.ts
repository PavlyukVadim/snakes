export class Snake{

	INITIAL_LENGTH: number = 150;
  PIECE_SNAKE_RADIUS: number = 5.3;
  SPEED: number = 2;
  ROTATION_SPEED: number = 5;
  COLOR: string = '#ff5050';
  

	x: number;
	y: number;
	angle: number;
	length: number;
	ctx: any;
	coordinates : {
		x: Array<number>,
		y: Array<number>
	};

	interval : any;
  ws: WebSocket;
	constructor(color: string, x: number, y: number, angle: number, length: number, ctx: any, ws: WebSocket) {
		this.COLOR = color || this.COLOR;
    this.ws = ws;
    this.x = x;
		this.y = y;
		this.angle = angle;
		this.length = length;
		this.ctx = ctx;
		this.coordinates = {
    	x : [],
    	y : []
  	};
	}

  draw() {
    this.ctx.beginPath();
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = this.COLOR;
    this.ctx.arc(this.x, this.y, this.PIECE_SNAKE_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }


  start(canvasSetting: Object) {
    this.interval = setInterval(this.running, 30, canvasSetting, this);
  }


  running(cSetting: Object, that: any) {
    let radian = that.convertDegInRad(that.angle);
    that.x += that.SPEED * Math.cos(radian);
    that.y += that.SPEED * Math.sin(radian);
    that.validationCoordinates(cSetting);
    that.pushCoordinates();
    that.draw();
  }

  pushCoordinates() {
    this.coordinates.x.push(this.x);
    this.coordinates.y.push(this.y);
    this.snakeLengthControl();
  }

  snakeLengthControl() {
    if (this.coordinates.x.length > this.length) {
      //for (var i = 0; i < this.coordinates.x.length - this.length; i++) {
        
        this.ctx.beginPath();
        this.ctx.clearRect(this.coordinates.x[0] - this.PIECE_SNAKE_RADIUS - 3,
                           this.coordinates.y[0] - this.PIECE_SNAKE_RADIUS - 3,
                           this.PIECE_SNAKE_RADIUS * 2 + 4, this.PIECE_SNAKE_RADIUS * 2 + 4);
        this.ctx.closePath();

        this.ws.send(JSON.stringify({
          type : 'clean',
          x: this.coordinates.x[0],
          y: this.coordinates.y[0]
        }));

        this.coordinates.x.shift();
        this.coordinates.y.shift();
      //}
    }
  }

  convertDegInRad(angle: number) {
    return (angle * Math.PI) / 180;
  }

  validationCoordinates(cSetting: any) {
    if(this.x < cSetting.THICNESS_WALL || this.x > cSetting.mapW - cSetting.THICNESS_WALL || 
       this.y < cSetting.THICNESS_WALL || this.y > cSetting.mapH - cSetting.THICNESS_WALL) {
       if (this.x < cSetting.THICNESS_WALL) {
         this.x = cSetting.mapW - cSetting.THICNESS_WALL;
         return;
       }
       else if (this.x > cSetting.mapW - cSetting.THICNESS_WALL) {
         this.x = cSetting.THICNESS_WALL;
         return;
       }
       else if (this.y < cSetting.THICNESS_WALL) {
         this.y = cSetting.mapH - cSetting.THICNESS_WALL;
         return;
       }
       else if (this.y > cSetting.mapH - cSetting.THICNESS_WALL) {
         this.y = cSetting.THICNESS_WALL;
         return;
       }
    }
  }

  /*checkСollision(food: any = []) {
    var clipWidth = 10;

    var clipOffsetX = 12 * Math.cos(this.convertDegInRad(this.angle)),
        clipOffsetY = 12 * Math.sin(this.convertDegInRad(this.angle));
    var imageData = this.ctx.getImageData(-this.PIECE_SNAKE_RADIUS + this.x + clipOffsetX + 50 * Math.cos(this.convertDegInRad(this.angle)),
                                     -this.PIECE_SNAKE_RADIUS + this.y + clipOffsetY + 50 * Math.sin(this.convertDegInRad(this.angle)),
                                     clipWidth, clipWidth);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(-this.PIECE_SNAKE_RADIUS + this.x + clipOffsetX + 50 * Math.cos(this.convertDegInRad(this.angle)),
                                     -this.PIECE_SNAKE_RADIUS + this.y + clipOffsetY + 50 * Math.sin(this.convertDegInRad(this.angle)),
                                     clipWidth, clipWidth);
    // Loop through the clip and see if you find red or blue. 
    for (let i = 0; i < clipWidth * clipWidth * 4; i += 4) {
      let r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16),
          g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16),
          b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
      let color: string = '#' + r + g + b; 

      if (color == this.COLOR) {
        //if (!losing) {
          setTimeout(clearInterval, 250, this.interval); 
          //losing = !losing;
          //setTimeout(finish, 300);
        //}
        break;
      }
    }
  }*/


  turnLeft() {
    this.angle -= this.ROTATION_SPEED;
    this.move(true);
  }

  turnRight() {
    this.angle += this.ROTATION_SPEED;
    this.move(true);
  }

  move(rotate: boolean = false) {
    if (rotate) {
      this.SPEED = 1.6;  
    }
    else {
      this.SPEED = 2;  
    }
    
    this.x += this.SPEED * Math.cos(this.convertDegInRad(this.angle));
    this.y += this.SPEED * Math.sin(this.convertDegInRad(this.angle));
    this.pushCoordinates();
    this.draw();
  }

  stop() {
    clearInterval(this.interval);
    //document.removeEventListener('keydown', snakeControl);
    alert("Finish");
  }

}  