import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from './user';


let jumbotron: HTMLElement;

@Component({
    selector: 'start-app',
    templateUrl: 'html/start.html'
})

export class StartComponent {
	
	@Output() transferUser: EventEmitter<User> = new EventEmitter<User>();
	@Input() userName: string;

	start: boolean = false;

	user: User = {
		name: "Anonim",
		color: "#ff5050"
	};

	play() {
		this.start = true;
		this.transferUser.emit(this.user);
		console.log(this.user);
	}

  	inputName(value: string) {
    	this.user.name = value;
	}
}   