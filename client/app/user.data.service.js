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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var UserDataService = (function () {
    function UserDataService(http) {
        this.http = http;
        this.heroesUrl = '/user-login'; // URL to web API
    }
    /*getHeroes (){
        return this.http.get(this.heroesUrl)
            .map(his.extractData);
            //.catch(this.handleError);
    }*/
    UserDataService.prototype.postUserData = function (userLogin, userPass) {
        var json = JSON.stringify({ login: userLogin, password: userPass });
        console.log(json);
        var params = json;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post('/user-login', params, {
            headers: headers
        })
            .map(function (res) { return res.json(); });
    };
    UserDataService.prototype.extractData = function (res) {
        var body = res.json();
        return body.date || {};
    };
    UserDataService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    UserDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserDataService);
    return UserDataService;
}());
exports.UserDataService = UserDataService;
//# sourceMappingURL=user.data.service.js.map