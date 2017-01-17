import {  Injectable, Pipe, PipeTransform} from '@angular/core';
import { passenger } from './passanger.Model';
import { passengerDetail } from '../PassengersBackendService.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { passangerFilter } from './passangerFilter.Model'

@Pipe({
    name: 'customerSelectedFilter', pure: false
})
@Injectable()
export class CustomerSelectedFilter implements PipeTransform {
    transform(customers: passenger[], value: boolean): any {
        //debugger;
        console.log(value);
        if (customers != null && customers.length > 0) {
            return customers.filter(customer => customer.isSelected == value);
        }
        else {
            return [];
        }
    }
}
@Pipe({
    name: 'passangersSelectedFilter', pure: false
})
@Injectable()
export class PassangersSelectedFilter implements PipeTransform {
    transform(passengers: Observable<passengerDetail[]>, value: boolean): any {
        //debugger;
        // console.log(value);
        if (passengers != null) {
            //  debugger;
            return passengers.map((d: passengerDetail[]) => d.filter(passenger => passenger.isSelected == value));

        }
         return new Observable<passengerDetail[]>();

    }
}

@Pipe({
    name: 'passangersDataFilter', pure: false
})
@Injectable()
export class passangersDataFilter implements PipeTransform {
    transform(passengers: Observable<passengerDetail[]>, value: passangerFilter): any {

        // console.log(value);
        if (passengers != null) {
            return passengers.map((d: passengerDetail[]) =>
                d.filter(
                    passenger =>
                    //    (passangerFilter.name == null || passangerFilter.name == '' || (passenger != null && passangerFilter.name != null && passangerFilter.name != '' &&
                    //(
                    //    (passenger.ticket != null && passenger.ticket != '' && passenger.ticket.indexOf(passangerFilter.name) !== -1)
                    //||  (passenger.lastName != null && passenger.lastName != '' && passenger.lastName.indexOf(passangerFilter.name) !== -1)
                    //||  (passenger.pnr != null && passenger.pnr != '' && passenger.pnr.indexOf(passangerFilter.name) !== -1)
                    //)))

                    //    &&
                        passenger.isSelected == value.isSelected));

        }
        return new Observable<passengerDetail[]>();

    }
}
