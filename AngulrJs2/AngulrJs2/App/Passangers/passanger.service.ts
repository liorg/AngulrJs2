import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Result } from '../Result.Model';

import { orderFlightPostponedRequest, passengerExtra } from './orderFlightPostponedRequest.Model';

@Injectable()
export class PassengerService {
    private _url = 'api/CRM/GetAllPassangers?flight=';
    private _urlFindFlight = 'api/CRM/FindFlight?flight=';
    private _urlCreateFlightPostponed = 'api/CRM/CreateNewOrderFlightPostponed';
    constructor(private _http: Http) { }

    getExtraPassenger(oid: string): Observable<Result<passengerExtra>> {
        // debugger;
        return this._http.get('api/CRM/GetExtraPassenger?oid=' + oid)
            .map((response: Response) => <Result<passengerExtra>>response.json())
            // .do(data => { debugger; console.log('All: ' + JSON.stringify(data)) })
            .catch(this.handleError);
    }

    CreateNewOrderFlightPostponed(request: orderFlightPostponedRequest): Observable<Result<string>> {
        // debugger;
        return this._http.post(this._urlCreateFlightPostponed, request)
            .map((response: Response) => <Result<string>>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
