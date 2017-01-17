import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Result } from '../Result.Model';
import { passenger } from './passanger.Model';
import { FlightDetail } from './FlightDetail.Model';
import { orderFlightPostponedRequest } from './orderFlightPostponedRequest.Model';

@Injectable()
export class PassengerService {
    private _url = 'api/CRM/GetAllPassangers?flight=';
    private _urlFindFlight = 'api/CRM/FindFlight?flight=';
    private _urlCreateFlightPostponed = 'api/CRM/CreateNewOrderFlightPostponed';
    constructor(private _http: Http) { }

    getAllPassangers(flight: string): Observable<Result<passenger[]>> {
       // debugger;
        return this._http.get(this._url + flight)
            .map((response: Response) => <Result<passenger[]>>response.json())
            .catch(this.handleError);
    } 

    getFlight(flightid: string): Observable<Result<FlightDetail>> {
        // debugger;
        return this._http.get(this._urlFindFlight + flightid)
            .map((response: Response) => <Result<FlightDetail>>response.json())
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
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }


}
