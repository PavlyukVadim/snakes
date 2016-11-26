/**
 * Created by amadev on 26.11.16.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDataService } from  './user.data.service';

@Component({
    selector: 'login-app',
    templateUrl: 'html/login.html',
    providers: [UserDataService]
})

export class LoginComponent {

    getData: string;

    constructor(private  _httpService: UserDataService) {

    }

    submitted = false;
    onSubmit() {
        this.submitted = true;

        this._httpService.postUserData("amadev", "qwerty")
         .subscribe(
            data => this.getData = JSON.stringify(data),
            error => alert(error),
            () => console.log("Finish: " + this.getData)
         );
    }
}


