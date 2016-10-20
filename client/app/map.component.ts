import { Component, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import { Snake } from './snake';
import { Food } from './food';




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

	constructor() {
		this.food = [];
	}


	ngAfterViewInit() {
		var ws = new WebSocket("ws://127.0.0.1:8081/");
		

		setInterval(function () {
			ws.send(JSON.stringify({
		    x: 10,
		    y: 10,
		    angle: 20,
		    length: 50,
		    color: 65,
		    snakeCoord : 54
		  }));
		}, 1000);


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
		var snake : Snake = new Snake(100, 100, 2, 150, this.ctx);
		
		setInterval(function (that) {
			that.food.push(new Food(that.cWidth, that.cHeight, 20, that.ctx));
			that.food[that.food.length - 1].draw(that.ctxf);
		}, 1000, this);

		setInterval(function (that, snake) {
			that.findFoodCollision(snake);
		}, 40, this, snake);
		

		snake.draw();
		snake.start({
			THICNESS_WALL : THICNESS_WALL,
			mapW : this.cWidth,
			mapH : this.cHeight
		});


		document.addEventListener('keydown', function snakeControl(e) {
			if (e.which == 37) {
				snake.turnLeft();		
			}
			else if (e.which == 39) {
				snake.turnRight();
			}
		})
	 	
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

	drawWall() {
	  this.ctx.strokeStyle = "#f00";
	  this.ctx.setLineDash([5, 15]);
	  this.ctx.strokeRect(0 + THICNESS_WALL, 0 + THICNESS_WALL,
	                      this.cWidth - 2 * THICNESS_WALL, this.cHeight - 2 * THICNESS_WALL);
	  this.ctx.stroke(); 
	}
}