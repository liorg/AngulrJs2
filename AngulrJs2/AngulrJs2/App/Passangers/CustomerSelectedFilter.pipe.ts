import {  Injectable, Pipe, PipeTransform} from '@angular/core';
//import { passenger } from './passanger.Model';
import { passengerDetail } from '../PassengersBackendService.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { passangerFilter } from './passangerFilter.Model'

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
                    passenger => {
                        if (value.names != null && value.names.length > 0) {
                            for (let i = 0; i < value.names.length; i++) {
                                let find = value.names[i] != null && value.names[i] != "" ? value.names[i].toLowerCase() : "";
                                
                                if (passenger.isSelected == value.isSelected && value.names[i] != null && value.names[i] != "") {
                                    if (passenger.lastName != null && passenger.lastName != "" && passenger.lastName.toLowerCase().indexOf(find) > -1) {
                                        return true;
                                    }
                                    if (passenger.pnr != null && passenger.pnr != "" && passenger.pnr.toLowerCase().indexOf(find) > -1) {
                                        return true;
                                    }
                                    if (passenger.ticket != null && passenger.ticket != "" && passenger.ticket.toLowerCase().indexOf(find) > -1) {
                                        return true;
                                    }
                                }
                            }
                        }
                        else return passenger.isSelected == value.isSelected;
                    }
                ));

        }
        return new Observable<passengerDetail[]>();

    }
}
