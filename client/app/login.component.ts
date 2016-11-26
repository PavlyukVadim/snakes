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
    login: string;
    password: string;

    userData: any;

    constructor(private  _httpService: UserDataService) {}

    submitted = false;
    onSubmit() {
        //click Log in
        if (!this.submitted) {
            this._httpService.postUserData(this.login, this.password)
                .subscribe(
                    data => this.getData = JSON.stringify(data),
                    error => alert(error),
                    () => {
                        this.submitted = true;
                        this.userData = JSON.parse(this.getData);
                        //alert("Finish: " + );
                        console.log(this.userData);
                    }
                );
        }
        // click Log out
        else {
            this.login = "";
            this.password = "";
            this.submitted = false;
        }
    }

    onKeyLogin(value: string) {
        this.login = value;
    }
    onKeyPass(value: string) {
        this.password = value;
    }
}