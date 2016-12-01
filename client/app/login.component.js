"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by amadev on 26.11.16.
 */
var core_1 = require('@angular/core');
var user_data_service_1 = require('./user.data.service');
var LoginComponent = (function () {
    function LoginComponent(_httpService) {
        this._httpService = _httpService;
        this.gameStatus = new core_1.EventEmitter();
        this.submitted = false;
    }
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        //click Log in
        if (!this.submitted) {
            this._httpService.postUserData(this.login, this.password)
                .subscribe(function (data) { return _this.getData = JSON.stringify(data); }, 
            //error => alert(error),
            function (error) { return alert("Wrong password!!!"); }, function () {
                _this.submitted = true;
                _this.gameStatus.emit({ login: _this.login,
                    password: _this.password });
                _this.userData = JSON.parse(_this.getData);
                //alert("Finish: " + );
                console.log(_this.userData);
            });
        }
        else {
            this.login = "";
            this.password = "";
            this.submitted = false;
            this.gameStatus.emit({ login: this.login,
                password: this.password });
        }
    };
    LoginComponent.prototype.onKeyLogin = function (value) {
        this.login = value;
    };
    LoginComponent.prototype.onKeyPass = function (value) {
        this.password = value;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LoginComponent.prototype, "gameStatus", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-app',
            templateUrl: 'html/login.html',
            providers: [user_data_service_1.UserDataService]
        }), 
        __metadata('design:paramtypes', [user_data_service_1.UserDataService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map