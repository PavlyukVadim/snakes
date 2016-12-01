/**
 * Created by amadev on 02.12.16.
 */
/**
 * Created by amadev on 26.11.16.
 */
import { Injectable }     from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UpdateUserService {

    date: string;

    private heroesUrl = '/user-login';  // URL to web API
    constructor (private http: Http) {}
    /*getHeroes (){
     return this.http.get(this.heroesUrl)
     .map(his.extractData);
     //.catch(this.handleError);
     }*/

    postUserData (userLogin: string, userPass: string){
        var json = JSON.stringify({update: true, login: userLogin, password: userPass});
        console.log(json);
        var params = json;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post('/user-login', params, {
            headers: headers
        })
            .map(res => res.json());
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.date || { };
    }
    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}