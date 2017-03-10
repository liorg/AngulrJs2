///<reference path=".././jquery.d.ts" />
///<reference path=".././Application.d.ts" />
/// <reference path=".././globals.d.ts" />
import { ViewChild, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Renderer, ElementRef, Component, OnInit, AfterViewInit, OnDestroy, Injectable, Pipe, PipeTransform, Inject} from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { Subscription }              from 'rxjs/Subscription';
import { Result }                    from '../Result.Model'
import { PassangersSelectedFilter, passangersDataFilter }     from './CustomerSelectedFilter.pipe';
import { orderFlightPostponedRequest } from './orderFlightPostponedRequest.Model';
import { passangerFilter }          from './passangerFilter.Model'
import { DialogPassangerDirective, PassangerComponent } from './passanger.component';
import { Guid, MessagingConfig, PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService} from '../PassengersBackendService.service';
import { ProfileDetail }            from '../ProfileDetail.Model';
import { PassengerService }         from './passanger.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable  } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
@Component({
    moduleId: "app/Passangers/",
    selector: 'pm-passangersDetails',
    templateUrl: 'passangersr.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    entryComponents: [PassangerComponent]

})
export class PassangersrComponent implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild(DialogPassangerDirective) dialogAnchor: DialogPassangerDirective;

    PassangersTitle: string = '';
    private sub: Subscription;
    filghtId: string = '';
    errorMessage: string;
    allPassangersFilter: passangerFilter;
    passangersSelectedFilter: passangerFilter;
    CreateResultModel: Result<string>;
    hasData: boolean = false;
    FlightViewDetail: flightDetail;
    isReservationDetailShow: boolean = false;
    bodyRoot: any;
    nextDisable: boolean = false;
    profileModel: Result<ProfileDetail>;
    currentOrder: string = '';
    isLoading: boolean = true;
    messageText: string = '';
    selectedPassengerDetail: passengerDetail;
    nextEdit: BehaviorSubject<boolean>;
    nextEdit$: Observable<boolean>;
    currentExpriDateOrder?: Date;
    constructor(private _cd: ChangeDetectorRef,
        private _route: ActivatedRoute,
        private renderer: Renderer,
        private elRef: ElementRef,
        private _router: Router,
        private _passengersBackendService: PassengersBackendService,
        private _passengerService: PassengerService,
        private _uiStateStore: UiStateStore,
        private _bodyRootService: BodyRootService,
        @Inject("messaging.config") private messagingConfig: MessagingConfig
    ) {
        this.nextEdit = new BehaviorSubject<boolean>(false);
        this.messageText = this.messagingConfig.NOTIFY_SEARCH_SCREEN;
        this.nextEdit$ = this.nextEdit.asObservable();

        _passengersBackendService.flight$.subscribe((fli) => {
            this.FlightViewDetail = fli;
        });

        this.profileModel = profileUser;

        this.allPassangersFilter = { name: '', isSelected: false, freeText: '', names: [] };

        this.passangersSelectedFilter = { name: '', isSelected: true, freeText: '', names: [] };

        this._uiStateStore.uiState.subscribe((uistate) => {
            this.isLoading = uistate.actionOngoing;
            console.log(uistate.message);
            console.log(uistate.actionOngoing);
            console.log(uistate.isErr);
            if (uistate.isErr) {
                _bodyRootService.errorScreen.next({
                    hasErr: true,
                    isLogic: false,
                    title: this.messagingConfig.UNANDLE_EXCEPTION,
                    desc: uistate.message,
                    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                });
            }
        });

        this._bodyRootService.errorHanlderScreen$.subscribe((msgType) => {
            //debugger;
            switch (msgType) {
                case this.messagingConfig.MSG_TYPE_REFRESH_SITE: {
                    location.reload();
                    break;
                }
                case this.messagingConfig.MSG_TYPE_FROCELOAD: {
                    location.reload();
                    break;
                }
                case this.messagingConfig.MSG_TYPE_SEARCH: {
                    this.allPassangersFilter = { name: '', isSelected: false, freeText: '', names: [] };
                    break;
                }
                case this.messagingConfig.MSG_TYPE_ROUTE_BUS: {
                    this._router.navigate(['/FlightPostponed', this.FlightViewDetail.id, this.currentOrder]);
                    break;
                }
                default: {
                    //  debugger;
                    //  location.reload();
                    break;
                }
            }
        });
    }

    showPassanger_click(passenger: passengerDetail): void {
        debugger;
        this.dialogAnchor.createDialog(this.FlightViewDetail, passenger, Object.assign(PassangerComponent));
    }

    search_click(): void {
        debugger;
        if (this.allPassangersFilter.freeText == null || this.allPassangersFilter.freeText == '') {
            this.allPassangersFilter.names = [];
            this._bodyRootService.errorScreen.next({
                hasErr: true,
                isLogic: true,
                title: this.messagingConfig.TITLE_SEARCH_SCREEN,
                desc: this.messagingConfig.DESC_SEARCH_SCREEN,
                msgType: this.messagingConfig.MSG_TYPE_SEARCH
            });
        }
        else {
            this.allPassangersFilter.names = this.allPassangersFilter.freeText.split(',');
        }

    }

    showHideSelectedPassanger(isShow: boolean): void {
        this.isReservationDetailShow = isShow;
        this.renderer.setElementClass(this.bodyRoot, 'details-visible', isShow);
    }

    ngOnInit(): void {
        this.bodyRoot = this.elRef.nativeElement.offsetParent;
        this._bodyRootService.setInactive(false);
        this.sub = this._route.params.subscribe(
            params => {
                if (params['oid'] != null) {
                    this.currentOrder = params['oid'].toString();
                };
                let id = params['id'];
                this.filghtId = id.toString();
                this.setPassangers(this.filghtId, this.currentOrder);
            });
    }

    ngAfterViewInit(): void {
        Application.bindLoadUI();
        Application.bindRealTimeClock();
        Application.bindDateSelector();
        Application.bindOnBlurIvent();
        // Application.bindViewPassengerDetails();
        Application.bindScrollFunctions();

        this._passengersBackendService.hasSelectedPassngers$.subscribe((ishow) => {
            this.showHideSelectedPassanger(ishow);
            this.nextDisable = ishow;
            this.nextEdit.next(!this.nextDisable);
        });
    }

    ngOnDestroy() {
        this.showHideSelectedPassanger(false);
        this.sub.unsubscribe();
    }

    setClasses(passenger: passengerDetail) {
        let classes = {
            panel: true,
            passenger: true,
            handled: passenger.isHandleBy == true || passenger.canUpdate == true,
            checked: passenger.isSelecting
        };
        return classes;
    }

    trash_click(): void {
        this.setRollBack();
    }

    checkPassenger_click(passenger: passengerDetail): void {
        passenger.isTrashing = !passenger.isTrashing;
        if (passenger.isTrashing) {
            Application.showButton($('#reservation-details a.trash'));
            this.nextDisable = false;

        }
        else {
            Application.hideButton($('#reservation-details a.trash'), Application.defaultSpeed);
            this.nextDisable = true;
        }
        this.nextEdit.next(!this.nextDisable);
    }

    new_reservation_click(): void {
        Application.hideButton(Application.new_reservation, Application.defaultSpeed);
        this.changeSelectingToSelected();
    }

    add_reservation_click(): void {
        Application.hideButton(Application.add_reservation, Application.defaultSpeed);
        this.new_reservation_click();
    }

    viewDetails_click(): void {
        debugger;

        if (this.selectedPassengerDetail != null && this.selectedPassengerDetail.canUpdate) {
            if (this.selectedPassengerDetail.orderid != null && this.selectedPassengerDetail.orderid != '')
                this._router.navigate(['/Summery', this.selectedPassengerDetail.flightid, this.selectedPassengerDetail.orderid]);
        }
    }

    cancel_click(): void {
        this.setTrashAllPassengersselected();
        this.setRollBack();
    }

    next_click(): void {
        debugger;

        var isdisable = this.nextDisable;
        let id = profileUser.model.id;
        let request: orderFlightPostponedRequest;
        request = new orderFlightPostponedRequest();
        request.handleBy = id.toString();
        request.flight = this.filghtId.toString();
        request.orderid = this.currentOrder.toString();
        request.passangers = [];
        request.uniqueTranId = Guid.newGuid();
        this._passengersBackendService.UniqueTranId = request.uniqueTranId;
        this._passengersBackendService.CurrentTrackDateTime = new Date();
        let passengerSelected = this.getPassengersSelected();
        this.isLoading = true;
        passengerSelected.forEach(pass => {
            request.passangers.push(pass.id);
        });
        this._passengerService.CreateNewOrderFlightPostponed(request).subscribe(
            (resultModel) => {
                this.isLoading = false;
                if (resultModel.isErr && resultModel.titleErr.toLowerCase() != this.messagingConfig.TITE_EXCEED_TOTAL_BUS.toLowerCase()) {
                    this._bodyRootService.errorScreen.next({
                        hasErr: resultModel.isErr,
                        isLogic: !resultModel.isErrUnandleException,
                        title: resultModel.titleErr,
                        desc: resultModel.desc,
                        msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                    });
                    return;
                }
                this.CreateResultModel = resultModel;
                this.currentOrder = this.CreateResultModel.model;
                passengerSelected.forEach(pasx => {
                    pasx.orderid = this.currentOrder;
                    pasx.ownerRecordid = this.profileModel.model.id.toLowerCase()
                });

                this._passengersBackendService.saveCurrentState(this.currentOrder);
                if (resultModel.titleErr == this.messagingConfig.TITE_EXCEED_TOTAL_BUS) {
                    this._bodyRootService.errorScreen.next({
                        hasErr: resultModel.isErr,
                        isLogic: !resultModel.isErrUnandleException,
                        title: resultModel.titleErr,
                        desc: resultModel.desc,
                        msgType: this.messagingConfig.MSG_TYPE_ROUTE_BUS
                    });
                }
                else {
                    //this._cd.markForCheck(); // marks path
                    this._router.navigate(['/FlightPostponed', this.FlightViewDetail.id, this.currentOrder]);
                }
            },
            error => {
                this.isLoading = false;
                this.errorMessage = <any>error;
                //this._cd.markForCheck(); // marks path
                this._bodyRootService.errorScreen.next({
                    hasErr: true,
                    isLogic: false,
                    title: this.messagingConfig.UNANDLE_EXCEPTION,
                    desc: error,
                    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                });
            });
        //end function
    }

    back_click(): void {
        if (this.FlightViewDetail != null) {
            if (this.currentOrder != null && this.currentOrder != '') {
                this._router.navigate(['/Flight', this.FlightViewDetail.name, this.currentOrder, this.FlightViewDetail.id]);
            }
            else {
                this._router.navigate(['/Flight', this.FlightViewDetail.name]);
            };
        }
        else {
            this._router.navigate(['/Welcome']);
        }
    }

    selectedPassenger_click(passenger: passengerDetail): void {
        debugger;
        if (passenger.isSelecting) {
            // UNCHECK
            if (passenger.isHandleBy || passenger.canUpdate)
                Application.hideButton(Application.details_reservation, Application.defaultSpeed);
            else {
                if (!this.anySelectingPassangers()) {
                    Application.hideButton(Application.new_reservation, Application.defaultSpeed);
                    Application.hideButton(Application.add_reservation, Application.defaultSpeed);
                }
            }
            passenger.isSelecting = false;
            passenger.orderid = null;
            this._passengersBackendService.updatePassenger(passenger);
        }
        else {
            // CHECK
            if (passenger.isHandleBy || passenger.canUpdate) {
                let passengers = this._passengersBackendService.passangersCached;
                passengers.forEach(pp => {
                    pp.isSelecting = false;
                    if (this.currentOrder != null && this.currentOrder != '' && pp.orderid != null && pp.orderid == this.currentOrder) {
                        pp.orderid = null;
                        pp.expireOrder = null;
                    }
                });

                this.selectedPassengerDetail = passenger;
                if (!passenger.canUpdate)
                    Application.hideButton(Application.details_reservation, Application.defaultSpeed);
                else
                    Application.showButton(Application.details_reservation);

                Application.hideButton(Application.new_reservation, 0);
                Application.hideButton(Application.add_reservation, 0);
            }
            else {
                let passengers = this._passengersBackendService.passangersCached;
                passengers.filter(pp => pp.isHandleBy || pp.canUpdate).forEach(pp => pp.isSelecting = false);
                this.selectedPassengerDetail = null;
                if (this.currentExpriDateOrder== null)
                    this.currentExpriDateOrder = this._passengersBackendService.getExpriDateOrder;
                debugger;
                let isExpiDate = this.currentExpriDateOrder != null && new Date(<any>this.currentExpriDateOrder) > new Date();
                if (!isExpiDate) {
                    passenger.orderid = this.currentOrder;
                    passenger.expireOrder = this.currentExpriDateOrder;
                    if (this.isReservationDetailShow)
                        Application.showButton(Application.add_reservation);
                    else
                        Application.showButton(Application.new_reservation);
                }
                Application.hideButton(Application.details_reservation, 0);
            }
            passenger.isSelecting = true;
            this._passengersBackendService.updatePassenger(passenger);
        }
    }

    setPassangers(num: string, order: string): void {
        this._passengersBackendService.loadSessionStore(num, order);
    }

    anySelectingPassangers(): boolean {
        let passengers = this._passengersBackendService.passangersCached;
        if (passengers != null && passengers.length > 0) {
            let findPass = passengers.filter(
                pass => pass.isSelecting === true);

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

    setRollBack(): void {
        let passengersSelectedCount = this.passengersSelectedCount();
        this.isLoading = true;
        this._passengersBackendService.sendNotity(this._passengersBackendService.rollBackPassangers).subscribe((res) => {
            this.isLoading = false;
            if (res.isErr) {
                this._bodyRootService.errorScreen.next({
                    hasErr: res.isErr,
                    isLogic: !res.isErrUnandleException,
                    title: res.titleErr,
                    desc: res.desc,
                    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                });
                return;
            }

            let passengers = this._passengersBackendService.passangersCached;
            let trashsAsQuerable = passengers.filter(pas => pas.isTrashing);
            let trashs = trashsAsQuerable.forEach(pass => {
                pass.isSelected = false;
                pass.isTrashing = false;
                pass.isHandleBy = false;
                pass.handlyByName = '';
                pass.orderid = null;

            });
            let trashCount = trashsAsQuerable.length;
            //  this._passengersBackendService.publish();
            this._passengersBackendService.saveSelectedPassangers(res.model);
            if (trashCount == passengersSelectedCount) {
                this.showHideSelectedPassanger(false);
            }
        }, (err) => {
            this.isLoading = false;
            this._bodyRootService.errorScreen.next({
                hasErr: true,
                isLogic: false,
                title: this.messagingConfig.UNANDLE_EXCEPTION,
                desc: err,
                msgType: this.messagingConfig.MSG_TYPE_REFRESH_SITE
            });
        });

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
        this.isLoading = true;
        this._passengersBackendService.sendNotity(this._passengersBackendService.selectingPassangers).subscribe((res) => {
            this.isLoading = false;
            if (res.isErr) {
                this._bodyRootService.errorScreen.next({
                    hasErr: res.isErr,
                    isLogic: !res.isErrUnandleException,
                    title: res.titleErr,
                    desc: res.desc,
                    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                });
                this.showHideSelectedPassanger(false);
                this.nextDisable = false;
                this.nextEdit.next(!this.nextDisable);
            }
            else {
                let passengers = this._passengersBackendService.passangersCached;
                passengers.forEach(pass => {
                    if (pass.isSelecting) {
                        pass.isSelected = pass.isHandleBy ? false : true;
                        pass.isSelecting = false;
                        pass.ownerRecordid = this.profileModel.model.id.toLocaleLowerCase()
                    }
                });
                this._passengersBackendService.saveSelectedPassangers(res.model);
                this.showHideSelectedPassanger(true);
                this.nextDisable = true;
                this.nextEdit.next(!this.nextDisable);
            }
        }, (err) => {
            this.isLoading = false;
            this._bodyRootService.errorScreen.next({
                hasErr: true,
                isLogic: false,
                title: this.messagingConfig.UNANDLE_EXCEPTION,
                desc: err,
                msgType: this.messagingConfig.MSG_TYPE_DEFUALT
            });
            // console.warn(err);
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

    setTrashAllPassengersselected(): void {
        let passengers = this._passengersBackendService.passangersCached;
        passengers.forEach(pass => {
            pass.isSelected = true;
            pass.isTrashing = true;
        });
    }

    ping(): void {
        this._passengersBackendService.ping();
    }
}

