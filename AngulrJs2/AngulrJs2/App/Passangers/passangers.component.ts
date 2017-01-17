///<reference path=".././jquery.d.ts" />
///<reference path=".././Application.d.ts" />
/// <reference path=".././globals.d.ts" />
import { ViewEncapsulation,ChangeDetectionStrategy, ChangeDetectorRef, Renderer, ElementRef, Component, OnInit, AfterViewInit, OnDestroy, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }       from 'rxjs/Subscription';
import { passenger } from './passanger.Model';
import { Result } from '../Result.Model'
import { PassengerService } from './passanger.service';
import { CustomerSelectedFilter }     from './CustomerSelectedFilter.pipe';
//import { FlightDetail } from './FlightDetail.Model';
import { orderFlightPostponedRequest } from './orderFlightPostponedRequest.Model';

import { PassengersBackendService, passengerDetail } from '../PassengersBackendService.service';

@Component({
    moduleId: "app/Passangers/",
    selector: 'pm-passangersDetails',
    templateUrl: 'passangers.component.html',
   // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassangersComponent implements AfterViewInit, OnInit, OnDestroy {
    PassangersTitle: string = '';
    private sub: Subscription;
    filghtId: string = '';
    filghtPostponedId: string = '';
    errorMessage: string;
    Passengers: passenger[];
    CreateResultModel: Result<string>;
    FlightModel: Result<passenger[]>;
    hasData: boolean = false;
    FlightDetailModel: Result<FlightDetail>;
    FlightViewDetail: FlightDetail;
    badgeCount: string = "0";
    isReservationDetailShow: boolean = false;
    bodyRoot: any;
    nextDisable: boolean = false;

    constructor(private _cd: ChangeDetectorRef, private _route: ActivatedRoute, private renderer: Renderer, private elRef: ElementRef,
        private _router: Router,
        private _passengerService: PassengerService
    ) {

    }

    showHideSelectedPassanger(isShow: boolean): void {
        this.isReservationDetailShow = isShow;
        this.renderer.setElementClass(this.bodyRoot, 'details-visible', isShow);
    }

    //ngAfterContentChecked() {
    //    console.log("ngAfterContentChecked");
    //}

    ngOnInit(): void {
        this.bodyRoot = this.elRef.nativeElement.parentElement.parentElement;
        this.sub = this._route.params.subscribe(
            params => {
                let type = params['type'];
                let id = params['id'];
                this.filghtId = id.toString();
                this.getPassangers(this.filghtId);
                this.getFlight(this.filghtId);
            });
    }

    ngAfterViewInit(): void {
        Application.bindLoadUI();
        //Application.bindCheckPassengerButton();
        Application.bindRealTimeClock();
        Application.bindDateSelector();
        Application.bindOnBlurIvent();
        //  Application.bindNewReservationButton();
        Application.bindViewPassengerDetails();
        Application.bindHamburgerButton();
        Application.bindScrollFunctions();
    }

    ngOnDestroy() {
        this.showHideSelectedPassanger(false);
        this.sub.unsubscribe();
    }

    anySelectedPassangers(): boolean {
        if (this.Passengers != null && this.Passengers.length > 0) {
            let findPass = this.Passengers.filter(
                pass => pass.isSelecting === true);
          
            if (findPass != null && findPass.length > 0)
                return true;
        }
        return false;
    } 

    setClassNext() {
      //  debugger;
        let classes = {
            next: true,
            disabled: !this.nextDisable
        };
        return classes;
    }

    setClasses(passenger: passenger) {
        //console.log(passenger.id);
        let classes = {
            panel: true,
            passenger: true,
            handled: passenger.isHandleBy == true,
            checked: passenger.isSelecting
        };
        return classes;
    }

    trash_click(): void {
        let trashs = this.Passengers.filter(pas => pas.isTrashing);
        let selected = this.Passengers.filter(pas => pas.isSelected);
        if (trashs.length == selected.length) {
            this.showHideSelectedPassanger(false);
        }

        trashs.forEach(pass => {
            pass.isSelected = false;
            pass.isTrashing = false;
        });
    }

    checkPassenger_click(passenger: passenger): void {
        debugger;
        passenger.isTrashing = !passenger.isTrashing;
        if (passenger.isTrashing) {
            Application.showButton($('#reservation-details a.trash'));
            this.nextDisable = false;

        }
        else {
            Application.hideButton($('#reservation-details a.trash'), Application.defaultSpeed);
            this.nextDisable = true;
        }
    }

    new_reservation_click(): void {
       
        Application.hideButton(Application.new_reservation, Application.defaultSpeed);
        this.Passengers.forEach(pass => {
            if (pass.isSelecting) {
                pass.isSelected = pass.isHandleBy ? false : true;
                pass.isSelecting = false;
            }
        });
        this.badgeCount = this.Passengers.filter(pe => pe.isSelected == true).length.toString();
        this.showHideSelectedPassanger(true);
        this.nextDisable = true;
    }

    add_reservation_click(): void {
        Application.hideButton(Application.add_reservation, Application.defaultSpeed);
        this.new_reservation_click();
    }

    cancel_click(): void {
        debugger;
        this.Passengers.forEach(pass => {
            pass.isSelected = false;
            pass.isTrashing = false;
        });
        this.showHideSelectedPassanger(false);
        //$('.passenger:hidden').each(function () {
        //    $(this).slideDown().removeClass('checked');
        //});
        //$('body').removeClass('details-visible');
        //next.addClass('disabled');
        //if ($('.passenger.checked:visible').length > 0) {
        //    Application.showButton(Application.new_reservation);
        //    Application.hideButton(Application.add_reservation, 0);
        //} else {
        //    Application.hideButton(Application.add_reservation);
        //}
        //reserved_passengers.remove();
        //return false;
    }

    next_click(): void {
        if (this.filghtPostponedId == '') {
            var isdisable = this.nextDisable;
            let id = profileUser.model.id;
            let request: orderFlightPostponedRequest;
            request = new orderFlightPostponedRequest();
            request.handleBy = id.toString();
            request.flight = this.filghtId.toString();
            debugger;

            request.passangers =[];
            this.Passengers.filter(pas => pas.isSelected).forEach(pass => {
                debugger;
                request.passangers.push(pass.id);
            });
            this._passengerService.CreateNewOrderFlightPostponed(request).subscribe(
                (resultModel) => {
                    debugger;
                    this.CreateResultModel = resultModel;
                    this.filghtPostponedId = this.CreateResultModel.model;
                    this._cd.markForCheck(); // marks path
                    this._router.navigate(['/FlightPostponed', this.filghtPostponedId]);

                },
                error => {
                    this.errorMessage = <any>error;
                    this._cd.markForCheck(); // marks path
                });
        }

    }

    back_click(): void {
        if (this.FlightViewDetail != null) {
            this._router.navigate(['/Flight', this.FlightViewDetail.name]);
        }
        else {
            this._router.navigate(['/Welcome']);
        }
    }

    selectedPassenger_click(passenger: passenger): void {
        debugger;
        if (passenger.isSelecting) {
            // UNCHECK
            if (passenger.isHandleBy) {
                Application.hideButton(Application.details_reservation, Application.defaultSpeed);
            } else {
                if (!this.anySelectedPassangers()) {
                    debugger;
                    Application.hideButton(Application.new_reservation, Application.defaultSpeed);
                    Application.hideButton(Application.add_reservation, Application.defaultSpeed);
                }
            }
            passenger.isSelecting = false;
        }
        else {
            // CHECK
            if (passenger.isHandleBy) {
                Application.showButton(Application.details_reservation);
                Application.hideButton(Application.new_reservation, 0);
                Application.hideButton(Application.add_reservation, 0);
            }
            else {
                if (this.isReservationDetailShow)
                    Application.showButton(Application.add_reservation);
                else
                    Application.showButton(Application.new_reservation);
                Application.hideButton(Application.details_reservation, 0);
            }
            passenger.isSelecting = true;
        }
    }

    getPassangers(num: string): void {
        this._passengerService.getAllPassangers(num).subscribe(
            (flightResult) => {
                this.FlightModel = flightResult;
                this.Passengers = this.FlightModel.model;
                this.hasData = this.Passengers != null && this.Passengers.length > 0;
                this.badgeCount = this.Passengers.filter(pe => pe.isSelected == true).length.toString();
                this._cd.markForCheck();

            },
            error => {
                this._cd.markForCheck(); // marks path
                this.errorMessage = <any>error;

            });
    }

    getFlight(num: string): void {
        this._passengerService.getFlight(num).subscribe(
            (flightResult) => {
                this.FlightDetailModel = flightResult;
                this.FlightViewDetail = this.FlightDetailModel.model;
                this._cd.markForCheck(); // marks path
            },
            error => {
                this.errorMessage = <any>error;
                this._cd.markForCheck(); // marks path
            });
    }

}

