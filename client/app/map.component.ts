import { Component, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import { Snake } from './snake';
import { Food } from './food';
import { SnakesControl } from './snakes.control'; 


const THICNESS_WALL: number = 20; 


@Component({
  selector: 'map',
  templateUrl: 'html/map.html',
  //styleUrls: ''
})

export class MapComponent{
	@ViewChild('canvas') canvasRef:ElementRef;
	@ViewChild('canvasFood') canvasFoodRef:ElementRef;
	
	@Output() increaseScore = new EventEmitter<number>();

	canvas: HTMLCanvasElement;
	ctx: any;

	canvasFood: HTMLCanvasElement;
	ctxf: any;

	cWidth: number;
	cHeight: number;
	food: any;

	ws: WebSocket;
	snake : Snake;
	snakeControl : SnakesControl;

	constructor() {
		this.food = [];
	}


	ngAfterViewInit() {
		this.ws = new WebSocket("ws://127.0.0.1:8081/");


		this.canvas = this.canvasRef.nativeElement;
		this.canvasFood = this.canvasFoodRef.nativeElement;
		
		this.ctx = this.canvas.getContext('2d');
		this.ctxf = this.canvasFood.getContext('2d');

		this.cWidth = this.canvas.width;
		this.cHeight = this.canvas.height;
		this.start();
	}

	start() {
	
		this.drawWall();
		this.snake = new Snake(100, 100, 2, 150, this.ctx);
		this.snakeControl = new SnakesControl(this.ctx);		


		setInterval(() => {
			this.checkСollision();
		}, 20);
		

		setInterval(function (that) {
			that.food.push(new Food(that.cWidth, that.cHeight, 20, that.ctx));
			that.food[that.food.length - 1].draw(that.ctxf);
		}, 1000, this);

		setInterval(function (that, snake) {
			that.findFoodCollision(snake);
		}, 40, this, this.snake);
		

		this.snake.draw();
		this.snake.start({
			THICNESS_WALL : THICNESS_WALL,
			mapW : this.cWidth,
			mapH : this.cHeight
		});

		setInterval(function (that, snake) {
			that.ws.send(JSON.stringify({
		    type : 'draw',
		    x: snake.x,
		    y: snake.y,
		    COLOR : snake.COLOR
		  }));
		}, 20, this, this.snake);

		this.ws.onmessage = (event) => {
		  let change = JSON.parse(event.data);
		  if (change.type == 'draw') {
		  	change.PIECE_SNAKE_RADIUS = change.PIECE_SNAKE_RADIUS || this.snake.PIECE_SNAKE_RADIUS;
		  	this.snakeControl.drawAll(change);
		  } 
		  if (change.type == 'clean') {
		  	//this.snakeControl//this.snakeControl.drawAll(change);
		  }
		  //console.log(change);
		};

		document.addEventListener('keydown', (e) => { 
			if (e.which == 37) {
				this.snake.turnLeft();		
			}
			else if (e.which == 39) {
				this.snake.turnRight();
			} 
		});
	}





	findFoodCollision(snake: Snake) {
    for (var part of this.food) {
      if (snake.x > part.x - 10 && snake.x < part.x + 10 &&
      	  snake.y > part.y - 10 && snake.y < part.y + 10) {
        part.destroy(this.ctxf);
      	this.food.splice(this.food.indexOf(part), 1);
      	snake.length += 0.2;
      	this.increaseScore.emit(1);
      }
  	}
	}

	checkСollision() {
    var clipWidth = 10;

    var clipOffsetX = 12 * Math.cos(this.snake.convertDegInRad(this.snake.angle)),
        clipOffsetY = 12 * Math.sin(this.snake.convertDegInRad(this.snake.angle));
    var imageData = this.ctx.getImageData(-this.snake.PIECE_SNAKE_RADIUS + this.snake.x + clipOffsetX + 3 * Math.cos(this.snake.convertDegInRad(this.snake.angle)),
                                     -this.snake.PIECE_SNAKE_RADIUS + this.snake.y + clipOffsetY + 3 * Math.sin(this.snake.convertDegInRad(this.snake.angle)),
                                     clipWidth, clipWidth);
     
    for (let i = 0; i < clipWidth * clipWidth * 4; i += 4) {
      let r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16),
          g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16),
          b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
      let color: string = '#' + r + g + b; 

      if (color == this.snake.COLOR) {
        setTimeout(clearInterval, 300, this.snake.interval); 
        break;
      }
    }
  }


	drawWall() {
	  this.ctx.strokeStyle = "#f00";
	  this.ctx.setLineDash([5, 15]);
	  this.ctx.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL,
	                      this.cWidth - 2 * THICNESS_WALL, this.cHeight - 2 * THICNESS_WALL);
	  this.ctx.stroke(); 
	}
}