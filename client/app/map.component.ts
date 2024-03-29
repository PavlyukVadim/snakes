import { Component, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { Snake } from './snake';
import { Food } from './food';
import { SnakesControl } from './snakes.control'; 

const THICNESS_WALL: number = 20; 

@Component({
  selector: 'map',
  templateUrl: 'html/map.html'
})

export class MapComponent{
	@ViewChild('canvas') canvasRef:ElementRef;
	@ViewChild('canvasFood') canvasFoodRef:ElementRef;
	@Output() increaseScore = new EventEmitter<number>();
	@Output() gameStatus = new EventEmitter<boolean>();
	@Input() snakeColor: string;
	@Input() userName: string;
	snakesColors: Array<string> = [];
	usersScore: Array<any> = [];
	canvas: HTMLCanvasElement;
	ctx: any;
	canvasFood: HTMLCanvasElement;
	ctxf: any;
	cWidth: number;
	cHeight: number;
	food: any;
	ws: WebSocket;
	snake: Snake;
	snakeControl: SnakesControl;
	sendSnakeDataIntr: any; 
	findCollisionsIntr: any; 
	lose: boolean;

	constructor() {
		this.food = [];
		this.lose = false;
	}

	waitForConnection(callback: any, interval: any) {
    if (this.ws.readyState === 1) {
      callback();
    } else {
      setTimeout(() => { this.waitForConnection(callback, interval); }, interval);
    }
	}

	ngAfterViewInit() {
		this.ws = new WebSocket('ws://' + window.location.host + '/');
		this.canvas = this.canvasRef.nativeElement;
		this.canvasFood = this.canvasFoodRef.nativeElement;
		this.ctx = this.canvas.getContext('2d');
		this.ctxf = this.canvasFood.getContext('2d');
		this.cWidth = this.canvas.width;
		this.cHeight = this.canvas.height;
		this.start();
	}

	start() {	
		this.waitForConnection(() => {
      this.ws.send(JSON.stringify({
	    	type: 'new_snake',
	    	color: this.snakeColor,
	    	name: this.userName
	  	}));
    }, 1000);
		this.drawWall();
		let innilialX: number = ((Math.random() * (this.cWidth - 200)) + 100) >> 0;
		let innilialY: number = ((Math.random() * (this.cHeight - 200)) + 100) >> 0;
		this.snake = new Snake(this.snakeColor, innilialX, innilialY, 2, 30, this.ctx, this.ws, this.userName);
		this.snakeControl = new SnakesControl(this.ctx);		
		
		this.snake.draw();
		
		this.snake.start({
			THICNESS_WALL : THICNESS_WALL,
			mapW: this.cWidth,
			mapH: this.cHeight
		});
		
		this.findCollisionsIntr = setInterval(() => {
			this.findCollisions();
		}, 50);
		
		this.sendSnakeDataIntr = setInterval(() => {
			this.ws.send(JSON.stringify({
		    type : 'draw',
		    x: this.snake.x,
		    y: this.snake.y,
		    COLOR : this.snake.COLOR,
			name: this.userName
		  }));
		}, 20);

		this.ws.onmessage = (event) => {
		  if (this.lose) return;
		  let change = JSON.parse(event.data);
		  change.PIECE_SNAKE_RADIUS = change.PIECE_SNAKE_RADIUS || this.snake.PIECE_SNAKE_RADIUS;
		  if (change.type == 'new_snake') {
		  	this.snakesColors = change.colors;
		  } else if (change.type == 'change_name') {
		  	this.userName = change.name; 
		  } else if (change.type == 'initial_food') {
		  	change.data.forEach((element: any) => {
		  		this.food.push(new Food(this.cWidth, this.cHeight, 20, this.ctxf, element.x, element.y, element.color));	
		  	});
		  } else if (change.type == 'user_score') {
		  	this.usersScore = change.score.sort((a: any, b: any) => { return b.score - a.score });
		  } else if (change.type == 'draw') {
		  	this.snakeControl.drawAll(change);
		  } else if (change.type == 'clean') {
		  	this.snakeControl.clean(change);
		  } else if (change.type == 'food') {
		  	this.food.push(new Food(this.cWidth, this.cHeight, 20, this.ctxf, change.x, change.y, change.color));
		  } else if (change.type == 'destroy_food') {
		  	this.snakeControl.destroyFood(this.ctxf, change.x, change.y, change.PIECE_SNAKE_RADIUS + 3);
		  } else if (change.type == 'destroy_snake') {
		  	this.snakeControl.destroySnake(this.ctx, change.coordinates, change.PIECE_SNAKE_RADIUS + 3);
		  }
		};

		document.addEventListener('keydown', (e) => { 
			if (e.which == 37) {
				this.snake.turnLeft();		
			} else if (e.which == 39) {
				this.snake.turnRight();
			}
		});
	}

	drawWall() {
	  this.ctxf.strokeStyle = '#FF9000';
	  this.ctxf.setLineDash([5, 15]);
	  this.ctxf.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL,
	                       this.cWidth - 2 * THICNESS_WALL, this.cHeight - 2 * THICNESS_WALL);
	  this.ctxf.stroke(); 
	}

	findCollisions() {
		this.findFoodCollision();
		this.findSnakeСollision();
	}

	findFoodCollision() {
    for (var part of this.food) {
      if (this.snake.x > part.x - 10 && this.snake.x < part.x + 10 &&
      	  this.snake.y > part.y - 10 && this.snake.y < part.y + 10) {
        part.destroy(this.ctxf);
      	this.food.splice(this.food.indexOf(part), 1);
      	this.ws.send(JSON.stringify({
			    type: 'destroy_food',
			    x: part.x,
			    y: part.y,
			    name: this.userName,
			    color: this.snakeColor
	  		}));
      	this.snake.length += 1;
      	this.increaseScore.emit(1);
      }
  	}
	}

	findSnakeСollision() {
    let clipWidth = 10;
    let clipOffsetX = 12 * Math.cos(this.snake.convertDegInRad(this.snake.angle)),
        clipOffsetY = 12 * Math.sin(this.snake.convertDegInRad(this.snake.angle));
    let imageData = this.ctx.getImageData(-this.snake.PIECE_SNAKE_RADIUS + this.snake.x + clipOffsetX + 3 * Math.cos(this.snake.convertDegInRad(this.snake.angle)),
                                     			-this.snake.PIECE_SNAKE_RADIUS + this.snake.y + clipOffsetY + 3 * Math.sin(this.snake.convertDegInRad(this.snake.angle)),
                                     			clipWidth, clipWidth);
     
    for (let i = 0; i < clipWidth * clipWidth * 4; i += 4) {
	       let r = imageData.data[i + 0].toString(16).length > 1 ? imageData.data[i + 0].toString(16) : '0' + imageData.data[i + 0].toString(16),
	           g = imageData.data[i + 1].toString(16).length > 1 ? imageData.data[i + 1].toString(16) : '0' + imageData.data[i + 1].toString(16),
	           b = imageData.data[i + 2].toString(16).length > 1 ? imageData.data[i + 2].toString(16) : '0' + imageData.data[i + 2].toString(16);
      let color: string = '#' + r + g + b; 
      if (this.snakesColors.indexOf(color) != -1) {
        this.gameOver();
        break;
      }
    }
  }

  gameOver() {
  	clearInterval(this.snake.interval);
  	clearInterval(this.sendSnakeDataIntr);
		clearInterval(this.findCollisionsIntr);
		this.lose = true;
  	this.ws.send(JSON.stringify({
	    type: 'destroy_snake',
	    coordinates: this.snake.coordinates,
	    color: this.snakeColor,
	    name: this.userName
	  }));
    delete this.snake;
    this.gameStatus.emit(false);
  }
}
