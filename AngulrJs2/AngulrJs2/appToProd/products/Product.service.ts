import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {
    //private _productUrl = 'Demo/products/products.json';
    private _productUrl = 'Api/Crm/GetProducts';

    constructor(private _http: Http) { }

    getProducts(): Observable<any[]> {
        return this._http.get(this._productUrl)
            .map((response: Response) =><any[]>response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
