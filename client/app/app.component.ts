import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'my-app',
  templateUrl: 'html/app.html'
})

export class AppComponent {
	
  start: boolean = false; 

  user: User = { 
		name : "Anonim",
		color : "red"
	};

	score: number = 100;


	onTransferUser(user: User):void {
    this.start = true;
    this.user.name = user.name;
    this.user.color = user.color;
    console.log(this.user);
  }

  increaseScore(value: number){
  	console.log('1');
  	this.score += 1;
  }

  gameStatus(flag: boolean){
    this.start = flag;
  }



}
  