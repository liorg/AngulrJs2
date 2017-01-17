///<reference path=".././jquery.d.ts" />
///<reference path=".././Application.d.ts" />
/// <reference path=".././globals.d.ts" />
import { ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Renderer, ElementRef, Component, OnInit, AfterViewInit, OnDestroy, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }       from 'rxjs/Subscription';
import { Result } from '../Result.Model'
import { PassangersSelectedFilter, passangersDataFilter }     from './CustomerSelectedFilter.pipe';
//import { FlightDetail } from './FlightDetail.Model';
import { orderFlightPostponedRequest } from './orderFlightPostponedRequest.Model';
import { passangerFilter } from './passangerFilter.Model'
import { PassengersBackendService, passengerDetail, flightDetail, UiStateStore, UiState} from '../PassengersBackendService.service';

import { PassengerService } from './passanger.service';

@Component({
    moduleId: "app/Passangers/",
    selector: 'pm-passangersDetails',
    templateUrl: 'passangersr.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassangersrComponent implements AfterViewInit, OnInit, OnDestroy {
    PassangersTitle: string = '';
    private sub: Subscription;
    filghtId: string = '';
    filghtPostponedId: string = '';
    errorMessage: string;
    allPassangersFilter: passangerFilter;
    passangersSelectedFilter: passangerFilter;
    CreateResultModel: Result<string>;
    hasData: boolean = false;
    FlightViewDetail: flightDetail;
    //  badgeCount: string = "0";
    isReservationDetailShow: boolean = false;
    bodyRoot: any;
    nextDisable: boolean = false;

    constructor(private _cd: ChangeDetectorRef,
        private _route: ActivatedRoute, private renderer: Renderer, private elRef: ElementRef,
        private _router: Router,
        private _passengersBackendService: PassengersBackendService,
        private _passengerService: PassengerService,
        private _uiStateStore: UiStateStore
    ) {
        this.allPassangersFilter = { name: '', isSelected: false };
        this.passangersSelectedFilter = { name: '', isSelected: true };
        this._uiStateStore.uiState.subscribe((uistate) => {
            //debugger;
            console.log(uistate.message);
            console.log(uistate.actionOngoing);
            console.log(uistate.isErr);
        });
    }

    showHideSelectedPassanger(isShow: boolean): void {
        this.isReservationDetailShow = isShow;
        this.renderer.setElementClass(this.bodyRoot, 'details-visible', isShow);
    }

    PingSignalR() {
        debugger;
        this._passengersBackendService.callPingSignalR();
    }

    ngOnInit(): void {
        this.bodyRoot = this.elRef.nativeElement.parentElement.parentElement;
        this.sub = this._route.params.subscribe(
            params => {
                let type = params['type'];
                let id = params['id'];
                this.filghtId = id.toString();
                let getCurrentFlight = this.getFlight(this.filghtId);

                if (getCurrentFlight == null || getCurrentFlight.id != this.filghtId) {
                    this._router.navigate(['/Flight', this.filghtId]);
                    return;
                }
                this.FlightViewDetail = getCurrentFlight;
                this.setPassangers(this.filghtId);

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

    setClassNext() {
        //  debugger;
        let classes = {
            next: true,
            disabled: !this.nextDisable
        };
        return classes;
    }

    setClasses(passenger: passengerDetail) {
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
        debugger;
        let passengersSelectedCount = this.passengersSelectedCount();

        let trashCount = this.setTrashSelectingToSelected();

        if (trashCount == passengersSelectedCount) {
            this.showHideSelectedPassanger(false);
        }
    }

    checkPassenger_click(passenger: passengerDetail): void {
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
        debugger;
        Application.hideButton(Application.new_reservation, Application.defaultSpeed);

        this.changeSelectingToSelected();
    }

    add_reservation_click(): void {
        Application.hideButton(Application.add_reservation, Application.defaultSpeed);
        this.new_reservation_click();
    }

    cancel_click(): void {
        debugger;
        this.cancelPassengersselected();
        this.showHideSelectedPassanger(false);
    }

    next_click(): void {
        debugger;
        if (this.filghtPostponedId == '') {
            var isdisable = this.nextDisable;
            let id = profileUser.model.id;
            let request: orderFlightPostponedRequest;
            request = new orderFlightPostponedRequest();
            request.handleBy = id.toString();
            request.flight = this.filghtId.toString();
            debugger;

            request.passangers = [];
            let passengerSelected = this.getPassengersSelected();

            passengerSelected.forEach(pass => {
                debugger;
                request.passangers.push(pass.id);
            });
            this._passengerService.CreateNewOrderFlightPostponed(request).subscribe(
                (resultModel) => {
                    debugger;
                    this.CreateResultModel = resultModel;
                    this.filghtPostponedId = this.CreateResultModel.model;
                    passengerSelected.forEach(pasx => {
                        pasx.orderid = this.filghtPostponedId;
                    });
                    this._passengersBackendService.saveCurrentState();
                    this._cd.markForCheck(); // marks path
                    this._router.navigate(['/FlightPostponed', this.FlightViewDetail.id, this.filghtPostponedId]);
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

    selectedPassenger_click(passenger: passengerDetail): void {
        if (passenger.isSelecting) {
            // UNCHECK
            if (passenger.isHandleBy) {
                Application.hideButton(Application.details_reservation, Application.defaultSpeed);
            } else {
                if (!this.anySelectingPassangers()) {
                    debugger;
                    Application.hideButton(Application.new_reservation, Application.defaultSpeed);
                    Application.hideButton(Application.add_reservation, Application.defaultSpeed);
                }
            }
            passenger.isSelecting = false;
            this._passengersBackendService.updatePassenger(passenger);
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
            this._passengersBackendService.updatePassenger(passenger);
        }
    }

    setPassangers(num: string): void {
        this._passengersBackendService.loadSessionStore(num);
    }

    getFlight(num: string): flightDetail {
        return this._passengersBackendService.getCurrentFlight();
    }


    anySelectingPassangers(): boolean {
        let passengers = this._passengersBackendService.passangersCached;
        if (passengers != null && passengers.length > 0) {
            let findPass = passengers.filter(
                pass => pass.isSelecting === true);
            debugger;
            if (findPass != null && findPass.length > 1)
                return true;
        }
        return false;
    }

    passengersSelectedCount(): number {
        let passengers = this._passengersBackendService.passangersCached;
        let count = passengers.filter(pe => pe.isSelected == true).length;
        return count;
    }

    getPassengersSelected(): passengerDetail[] {
        let passengers = this._passengersBackendService.passangersCached;
        return passengers.filter(pe => pe.isSelected == true);
    }

    setTrashSelectingToSelected(): number {
        let passengers = this._passengersBackendService.passangersCached;
        let trashsAsQuerable = passengers.filter(pas => pas.isTrashing);
        let trashs = trashsAsQuerable.forEach(pass => {
            pass.isSelected = false;
            pass.isTrashing = false;
        });
        let count = trashsAsQuerable.length;

        return count;
    }

    changeSelectingToSelected() {
        debugger;
        this._passengersBackendService.sendNotity(this._passengersBackendService.selectingPassangers).subscribe((res) => {
            debugger;
            let passengers = this._passengersBackendService.passangersCached;
            passengers.forEach(pass => {
                if (pass.isSelecting) {
                    pass.isSelected = pass.isHandleBy ? false : true;
                    pass.isSelecting = false;
                }
            });
            this._passengersBackendService.publish();
            this.showHideSelectedPassanger(true);
            this.nextDisable = true;
        }, (err) => {
            debugger;
            console.warn(err);
        });
    }

    cancelPassengersselected(): void {
        let passengers = this._passengersBackendService.passangersCached;
        passengers.forEach(pass => {
            pass.isSelected = false;
            pass.isTrashing = false;
        });
        this._passengersBackendService.publish();
    }
}

