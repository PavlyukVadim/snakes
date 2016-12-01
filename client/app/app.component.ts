import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from './user';
import { UpdateUserService } from  './update.user.servise';

@Component({
  selector: 'my-app',
  templateUrl: 'html/app.html',
  providers: [UpdateUserService]
})

export class AppComponent {


  getData: string;
  constructor(private  _httpService: UpdateUserService) {}

  userLogin: string;
  userPass: string;


  start: boolean = false; 
  user: User = { 
		name : "",
		color : ""
	};

	score: number = 100;

    onTransferUser(user: User):void {
    this.start = true;
    this.user.name = user.name;
    this.user.color = user.color;
  }

  increaseScore(value: number){
  	this.score += 1;
  }

  getUser(user_: any){
    this.userLogin = user_.login;
    this.userPass = user_.password;
      if(this.userLogin) {
          this._httpService.postUserData(this.userLogin, this.userPass)
              .subscribe(
                  data => this.getData = JSON.stringify(data),
                  //error => alert(error),
                  () => {

                  }
              );
      }
  }

  gameStatus(flag: boolean){
    this.start = flag;
  }
}