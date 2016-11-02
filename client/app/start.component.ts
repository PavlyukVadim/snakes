import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from './user';


let jumbotron: HTMLElement;

@Component({
    selector: 'start-app',
    templateUrl: 'html/start.html'
})

export class StartComponent {
	
	@Output() transferUser: EventEmitter<User> = new EventEmitter<User>();

	start: boolean = false;

	user: User = {
		name : "Anonim",
		color : "red"
	};


	play() {
		this.start = true;
		this.transferUser.emit(this.user);
	}

  	inputName(value: string) {
    	this.user.name = value;
	}


}   