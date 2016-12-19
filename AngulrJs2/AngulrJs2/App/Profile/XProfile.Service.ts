import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ProfileDetail } from './ProfileDetail.Model';
import { Result } from './Result.Model';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class XProfileService {
    //private _productUrl = 'Demo/products/products.json';
    private _prfileUrl = 'api/CRM/GetCurrentProfile';


    constructor(private _http: Http) { }

    getProfile(): Observable<Result<ProfileDetail>> {
        return this._http.get(this._prfileUrl)
            .map((response: Response) => <Result<ProfileDetail>>response.json())
            .do(data => {
                debugger;
                if (data.isErr) {
                      Observable.throw(data.desc);
                }

                console.log('All: ' + JSON.stringify(data))
            } )
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
