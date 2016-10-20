import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'my-app',
  templateUrl: 'html/app.html',
  styles: [
  ':host /deep/ canvas { position: absolute; }'
  ]
})

export class AppComponent {
	user: User = {
		name : "Anonim",
		color : "red"
	};

	score: number = 100;


	onTransferUser(user: User):void {
    this.user.name = user.name;
    this.user.color = user.color;
  }

  increaseScore(value: number){
  	console.log('1');
  	this.score += 1;
  }
}
  