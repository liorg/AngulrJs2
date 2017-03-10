//https://coryrylan.com/blog/angular-observable-data-services
/// <reference path="./globals.d.ts" />
///<reference path="./jquery.d.ts" />
///<reference path="./Application.d.ts" />
import { Title }     from '@angular/platform-browser'
import { Injectable, Inject, Directive, EventEmitter, Input, Output} from '@angular/core';
import { FormControl, NgControl, FormBuilder, FormGroup, Validators, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable  } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer } from 'rxjs/Observer';
import { Subscription }       from 'rxjs/Subscription';
//import {Rx} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publish';

import { Result } from './Result.Model';
import { ProfileDetail } from './ProfileDetail.Model';

import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';
import {ChannelService, ConnectionState, SessionStatus, passangerLocked, userHandle} from "./channel.service";

//https://github.com/jhades/angular2-rxjs-observable-data-services
//http://blog.angular-university.io/angular-2-application-architecture-building-applications-using-rxjs-and-functional-reactive-programming-vs-redux/

export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}


export class UiState {
    constructor(public actionOngoing:
        boolean, public message: string,
        public isErr: boolean, public forceLoad: boolean

    ) {
    }
}

export class MessagingConfig {
    UNANDLE_EXCEPTION: string;
    REFRESH: string;
    MSG_TYPE_DEFUALT: string;
    MSG_TYPE_HOTEL_PREFFER: string;
    MSG_PREFER_HOTEL: string;
    MSG_TYPE_REFRESH_SITE: string;
    LOGIC_TITLE: string;
    TITLE_SCREEN: string;
    MSG_TYPE_WARNING: string;
    MSG_TYPE_ROUTE_BUS: string;
    TITE_EXCEED_TOTAL_BUS: string;
    MSG_TYPE_SEARCH: string;
    TITLE_SEARCH_SCREEN: string;
    DESC_SEARCH_SCREEN: string;
    NOTIFY_SEARCH_SCREEN: string;
    TITLE_CONNECTIONLESS: string;
    DESC_CONNECTIONLESS: string;
    TIME_RETRY_CONNECTION: number;
    MSG_TYPE_FROCELOAD: string;
    TIME_HOURS_CHECKOUT: number;
    constructor() {

    }
}

export class errMessage {
    hasErr: boolean;
    isLogic: boolean;
    title: string;
    desc: string;
    msgType: string;
}

export class TrackDateUpdate {
    trackid: string;
    timestamp: Date;

}

export class TrackDeltaUpdate extends TrackDateUpdate {
    flightid: string;
    passangerid: string;
    isHandle: boolean;
    handleByName: string;
    handleById: string;
    orderid: string;
    allowAdd: boolean;
    allowEdit: boolean;
    expireOrder?: Date;
}

export const trackEvent = {
    orderId: '',
   // trackId: '',
    uniqueTranId: '',
    lastUpdate: new Date()
};

export const initialUiState = {
    actionOngoing: false,
    message: 'Ready', isErr: false, forceLoad: true
};

@Injectable()
export class UiStateStore {

    private _uiState: BehaviorSubject<UiState> = new BehaviorSubject(initialUiState);

    get uiState(): Observable<UiState> {
        return this._uiState.asObservable();
    }

    startBackendAction(message: string) {
        console.log("startBackendAction=" + message);
        this._uiState.next({
            actionOngoing: true,
            message,
            isErr: false, forceLoad: true
        });
    }

    endBackendAction(message: string, isErr: boolean) {
        console.log("endBackendAction=" + message + ",isErr=" + isErr);
        this._uiState.next({
            actionOngoing: false,
            message: message, isErr: isErr, forceLoad: isErr
        });
    }

    //signalErr(message: string) {
    //    let getLast = this._uiState.getValue();
    //    this._uiState.next({
    //        actionOngoing: getLast.actionOngoing,
    //        message: message, isErr: getLast.isErr, forceLoad: true
    //    });
    //}
}

export class currentContextCache {
    flight: flightDetail;
    passengers: passengerDetail[];
    lastUpdate: Date;
    forceReload: boolean;
    trackId: string;
    orderid: string;
}

export interface passengerDetail {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    //email: string;
    //phone: string;
    ticket: string;
    pnr: string;
    handlyByName: string;
    handleById: string;
    ownerRecordid: string;//owner user
    isHandleBy: boolean;
    cabin: string;
    isSelected: boolean;
    isSelecting: boolean;
    isTrashing: boolean;
    flightid: string;
    orderid: string;
    canUpdate: boolean;
    allowAdd: boolean;
    allowEdit: boolean;
    member: string;
    expireOrder?: Date;
}

export interface flightDetail {
    id: string;
    name: string;
    number: string;
    departure: string;
    destination: string;
    departureDates: string;
    arrivedDates: string;
    departureTime: string;
    arrivedTime: string;
    isSelected: boolean;
}

export interface contextPassangers {
    flight: flightDetail;
    currentOrder: string;
    passengers: passengerDetail[];
}

@Injectable()
export class PassengersBackendService {
    //https://angular-2-training-book.rangle.io/handout/observables/cold_vs_hotObsv_observables.html
    //hotObsv: Rx.ConnectableObservable<SessionStatus>;
    //subscription: Subscription;
    //private channel = "tasks";
    connectionState$: Observable<string>;
    passengers: Observable<passengerDetail[]>;
    private _passengers: BehaviorSubject<passengerDetail[]>;
    private _flight: BehaviorSubject<flightDetail>;
    flight$: Observable<flightDetail>;
    // private baseUrl: string;
    private dataStore: currentContextCache;
    profileModel: Result<ProfileDetail>;
    private cachName: string = "contextElal00f313";
    private _isDisconnected: BehaviorSubject<boolean>;
    isDisconected$: Observable<boolean>;

    private _hasSelectedPassngersCurrentOrder: BehaviorSubject<boolean>;
    hasSelectedPassngers$: Observable<boolean>;

    constructor(private http: Http, private _localSession: SessionStorageService,
        private channelService: ChannelService,
        private _uiStateStore: UiStateStore, private _titleService: Title,
        @Inject("messaging.config") private messagingConfig: MessagingConfig,
        private _router: Router
    ) {
        this._isDisconnected = new BehaviorSubject<boolean>(true);
        this._hasSelectedPassngersCurrentOrder = new BehaviorSubject<boolean>(false);
        this.isDisconected$ = this._isDisconnected.asObservable();
        this.hasSelectedPassngers$ = this._hasSelectedPassngersCurrentOrder.asObservable();
        this.profileModel = profileUser;

        // Let's wire up to the signalr observables
        this.connectionState$ = this.channelService.connectionState$
            .map((state: ConnectionState) => {
                let connectionName = ConnectionState[state];
                return connectionName;
            }).share();//share 

        this.connectionState$.subscribe((status: string) => {
            let connectionName = status;
            this._titleService.setTitle(connectionName);// + " " + this.messagingConfig.TITLE_SCREEN);
            if (status == "Disconnected")
                this._isDisconnected.next(true);

            else this._isDisconnected.next(false);

        }, (error: any) => { });

        this.channelService.error$.subscribe(
            (error: any) => {
                console.log(error);
            },
            (error: any) => {
                this.handleErrorSignalR(error, "this.channelService.error$ occur error");
                console.log("errors$ error", error);
            }
        );

        // Wire up a handler for the starting$ observable to log the, success/fail result
        this.channelService.starting$.subscribe(
            () => {
                console.log("signalr service has been started");
            },
            (error) => {
                this.handleErrorSignalR(error, "signalr service failed to start!");
            }
        );

        //******************************************************************************************
        //SignalR Notification !!!
        //******************************************************************************************
        channelService.$subjectSessionStatus.subscribe(
            (sessionStatus: SessionStatus) => {
                debugger;
                if (sessionStatus.state != 1)
                    return;
                let data = this.dataStore;
                let foundAny = false;
                if (data != null && sessionStatus != null && sessionStatus.users != null && sessionStatus.users.length > 0) {
                    for (let i = 0; i < sessionStatus.users.length; i++) {
                        let user = sessionStatus.users[i];
                        if (trackEvent.uniqueTranId != null && trackEvent.uniqueTranId.toLowerCase() == user.uniqueTranId.toLowerCase())
                            continue;
                        if (user.userid.toLowerCase() == this.profileModel.model.id.toLowerCase()) {
                            //has more then one browser open so refresh page!!!
                            debugger;
                            this.resetCache();
                            var history_api = typeof history.pushState !== 'undefined';
                            // history.pushState must be called out side of AngularJS Code
                            if (history_api) history.pushState(null, '', '#');  // After the # you should write something, do not leave it empty
                            this._router.navigate(['/Disconnect']);    
                            return;
                        }
                        if (data.flight != null && data.flight.id != null && user.flightid.toLowerCase() != data.flight.id.toLowerCase())
                            continue;
                        for (let j = 0; j < user.passangers.length; j++) {
                            let changed = user.passangers[j];
                            let passanger = data.passengers.filter(pp => pp.id == changed.passangerid);
                            if (passanger != null && passanger[0] != null) {
                                passanger[0].isHandleBy = changed.isLocked;
                                passanger[0].handlyByName = changed.isLocked ? user.name : "";
                                passanger[0].handleById = user.userid;
                                passanger[0].orderid = changed.orderid;
                                passanger[0].allowAdd = changed.allowAdd;
                                passanger[0].allowEdit = changed.allowEdit;
                                passanger[0].isSelecting = false;
                                passanger[0].expireOrder = changed.expireOrder;
                                passanger[0].canUpdate = passanger[0].orderid != null && passanger[0].orderid != "" && !changed.isLocked;
                                foundAny = true;
                            }
                        }
                    }
                    if (foundAny) {
                        trackEvent.lastUpdate = sessionStatus.timestamp;
                       // trackEvent.trackId = sessionStatus.trackid;
                        data.forceReload = false;//no need to load again
                        this.saveSessionStore(data);
                        this._titleService.setTitle("End Update Passangers Locked");
                    }
                }
                console.log(sessionStatus.state);
            },
            error => {
                this.handleErrorSignalR(error, " channelService.$subjectSessionStatus.subscribe  occur error");
            });
         //******************************************************************************************
         //******************************************************************************************

        this.startChannel();

        this.dataStore = {
            passengers: [],
            flight: null,
            lastUpdate: new Date(),
            forceReload: false,
            trackId: null,
            orderid: null
        };

        let data = this.getCurrentCache();
        if (data != null) {
            this.dataStore = data;
        }

        this._passengers = <BehaviorSubject<passengerDetail[]>>new BehaviorSubject([]);
        this.passengers = this._passengers.asObservable();

        this._flight = new BehaviorSubject({
            id: '', name: '', number: '',
            departure: '', destination: '', departureDates: '',
            arrivedDates: '', departureTime: '', arrivedTime: '', isSelected: false
        });

        this.flight$ = this._flight.asObservable();
    }

    startChannel(): void {
        console.log("Starting the channel service");
        this._titleService.setTitle("Begin Start Connection");
        this.channelService.start();
        this._titleService.setTitle("Connection has be Started");
    }

    get passangersCached(): passengerDetail[] {
        return this.dataStore.passengers;
    }

    //get getCurrentTrackState(): string {
    //    return trackEvent.uniqueTranId;
    //}

    get CurrentTrackDateTime(): Date {
        return trackEvent.lastUpdate;
    }

    set CurrentTrackDateTime(d) {
        trackEvent.lastUpdate = d;
    }

    get UniqueTranId(): string {
        return trackEvent.uniqueTranId;
    }

    set UniqueTranId(uid) {
        trackEvent.uniqueTranId = uid;
    }

    getDeltaTrack(tid: Date): Observable<Result<TrackDeltaUpdate[]>> {
        let dd = tid instanceof Date ? tid.toISOString() : <any>tid;

        this._titleService.setTitle("Get Changing After Disconnected...");
        return this.http.get('api/CRM/GetDeltaTracking?tid=' + dd).map((response: Response) => <Result<TrackDeltaUpdate>>response.json())
            .catch(this.handleError);
    }

    saveDeltaChangedHelper(trackings: TrackDeltaUpdate[]): void {
        let foundAny = false;
        let data = this.dataStore;
        for (let i = 0; i < trackings.length; i++) {
            let track = trackings[i];
            if (data.flight != null && track.flightid.toLowerCase() != data.flight.id.toLowerCase())
                continue;
            let passanger = data.passengers.filter(pp => pp.id == track.passangerid);
            if (passanger != null && passanger[0] != null) {
                if (passanger[0].ownerRecordid != track.handleById) {
                    passanger[0].isHandleBy = track.isHandle;
                    passanger[0].handlyByName = track.isHandle ? track.handleByName : "";
                    passanger[0].handleById = track.handleById;
                    passanger[0].orderid = track.orderid;
                    passanger[0].isSelecting = false;
                    passanger[0].allowAdd = track.allowAdd;
                    passanger[0].allowEdit = track.allowEdit;
                    passanger[0].canUpdate = passanger[0].orderid != null && passanger[0].orderid != "" && !track.isHandle;
                    passanger[0].expireOrder = track.expireOrder;
                    foundAny = true;
                }
            }
            trackEvent.lastUpdate = track.timestamp;
            //trackEvent.trackId = track.trackid;
            data.lastUpdate = track.timestamp;
            //data.trackId = track.trackid;
        }
        if (foundAny) {
            this._titleService.setTitle("Update Status Passangers After Disconnected");
            data.forceReload = false;//no need to load again
            this.saveSessionStore(data);
        }
    }

    notifySelectedPassngersCurrentOrder(isShow: boolean): void {
        this._hasSelectedPassngersCurrentOrder.next(isShow);
    }

    loadSessionStore(flight: string, order: string): void {
        debugger;
        let data = this.getCurrentCache();
        if (data != null) {
            this.dataStore = data;
           // trackEvent.trackId = data.trackId;
            trackEvent.uniqueTranId = data.trackId;
            trackEvent.orderId = data.orderid;
            trackEvent.lastUpdate = data.lastUpdate;
        }

        if (this.dataStore.passengers == null || this.dataStore.passengers.length == 0 || data.flight == null || data.flight.id.toLowerCase() != flight.toLowerCase())
            this.forceLoad(flight, order);
        else if (this.dataStore.forceReload == true)
            this.forceLoad(flight, order);
        else if (order != trackEvent.orderId)
            this.replaceOrder(flight, order);
        else if (order == null || order == "") {
            //check if selected show realse him
            let userid = this.profileModel.model.id.toLowerCase();
            var anySelected = data.passengers.filter(f => f.isSelected && (f.orderid == null || f.orderid == "") && f.ownerRecordid.toLowerCase() == userid).length > 0;
            if (anySelected) {
                this.realseOrder(trackEvent.orderId, trackEvent.orderId, null, null);
                this.replaceOrder(flight, order);
            }
            else {
                this._hasSelectedPassngersCurrentOrder.next(false);
                this.publish();
            }
        }
        else {
            trackEvent.uniqueTranId = data.trackId;
            trackEvent.lastUpdate = data.lastUpdate;
            if (order != null && order != '') {
                trackEvent.orderId = order;
                this._hasSelectedPassngersCurrentOrder.next(true);
            }
            else
                this._hasSelectedPassngersCurrentOrder.next(false);

            this.publish();
        }
        this._titleService.setTitle("Loading Session Store Complete");
    }

    replaceOrder(flight: string, order: string) {
        debugger;
        this._hasSelectedPassngersCurrentOrder.next(false);
        let hasFound = false;
        this._uiStateStore.startBackendAction('replace Order...');
        this._titleService.setTitle("Replace Order ..");
        trackEvent.uniqueTranId = Guid.newGuid();
        let url = 'api/CRM/RealseAndReplace?flight=' + flight + '&user=' + this.profileModel.model.id + '&tid=' + trackEvent.uniqueTranId + '&order=' + order;
        this.http.get(url)
            .map((response: Response) => <Result<SessionStatus[]>>response.json())
            .catch(this.handleError)
            .subscribe((data: Result<SessionStatus[]>) => {
                if (data.isErr)
                    this._uiStateStore.endBackendAction(data.desc, true);
                else {
                    let dataTempStore = this.dataStore;
                    for (let tt = 0; tt < data.model.length; tt++) {
                        let sessionStatus = data.model[tt];
                       // trackEvent.trackId = sessionStatus.trackid;
                        trackEvent.lastUpdate = sessionStatus.timestamp;
                        if (dataTempStore != null && sessionStatus != null && sessionStatus.users != null && sessionStatus.users.length > 0) {
                            for (let i = 0; i < sessionStatus.users.length; i++) {
                                let user = sessionStatus.users[i];
                                if (dataTempStore.flight != null && dataTempStore.flight.id != null && dataTempStore.flight.id.toLowerCase() != user.flightid.toLowerCase())
                                    continue;
                                for (let j = 0; j < user.passangers.length; j++) {
                                    let changed = user.passangers[j];
                                    let passanger = dataTempStore.passengers.filter(pp => pp.id == changed.passangerid);
                                    if (passanger != null && passanger[0] != null) {
                                        passanger[0].ownerRecordid = changed.isLocked ? user.userid : "";
                                        passanger[0].isHandleBy = changed.isLocked;//false;//unlock
                                        passanger[0].handlyByName = changed.isLocked ? user.name : "";//user.userid.toLowerCase() != this.profileModel.model.id.toLowerCase()  && changed.isLocked ? user.name : "";
                                        // passanger[0].handleById = user.userid;
                                        passanger[0].orderid = changed.orderid;
                                        passanger[0].isSelecting = false;
                                        passanger[0].isSelected = passanger[0].orderid != null && passanger[0].orderid != "" && passanger[0].orderid.toLowerCase() == order.toLowerCase();
                                        passanger[0].canUpdate = passanger[0].orderid != null && passanger[0].orderid != "" && passanger[0].orderid.toLowerCase() != order.toLowerCase();
                                        passanger[0].isTrashing = false;
                                        passanger[0].allowAdd = changed.allowAdd;
                                        hasFound = passanger[0].isSelected;
                                    }
                                }
                            }
                        }
                    }
                    if (hasFound) 
                        this._hasSelectedPassngersCurrentOrder.next(true);
                    
                    this.dataStore.forceReload = data.isErr;
                    trackEvent.orderId = order;
                    //this.dataStore.trackId = trackEvent.trackId;
                    this.dataStore.orderid = trackEvent.orderId;
                    this.dataStore.lastUpdate = trackEvent.lastUpdate;
                    //let titleName = this._titleService.getTitle();
                    this.dataStore.trackId = trackEvent.uniqueTranId;
                    this._titleService.setTitle("Complete Replace order");
                    //trackEvent.uniqueTranId = Guid.newGuid();//reset uniqueTranId
                    this.saveSessionStore(this.dataStore);
                    this._uiStateStore.endBackendAction('done', false);
                }

            }, error => {
                this._uiStateStore.endBackendAction(error.toString, true);
            }
            );
    }

    forceLoad(flight: string, order: string) {
        console.log("flight:" + flight);
        this._uiStateStore.startBackendAction('Loading...');
        this._titleService.setTitle("Loading Passangers..");
        trackEvent.uniqueTranId = Guid.newGuid();
        let url = 'api/CRM/GetFlightPassangers?flight=' + flight + '&user=' + this.profileModel.model.id + '&tid=' + trackEvent.uniqueTranId + '&order=' + order;
        this.http.get(url)
            .map((response: Response) => <Result<contextPassangers>>response.json())
            .catch(this.handleError)
            .subscribe((data: Result<contextPassangers>) => {
                if (data.isErr)
                    this._uiStateStore.endBackendAction(data.desc, true);
                else {
                    if (data.model.currentOrder != '')
                        this._hasSelectedPassngersCurrentOrder.next(true);

                    this.dataStore.passengers = data.model.passengers;
                    this.dataStore.flight = data.model.flight;
                    this.dataStore.forceReload = data.isErr;
                    this.dataStore.orderid = data.model.currentOrder;
                    trackEvent.orderId = data.model.currentOrder;
                    trackEvent.lastUpdate = new Date();
                    //trackEvent.uniqueTranId = Guid.newGuid();//reset uniqueTranId
                    this.dataStore.lastUpdate = trackEvent.lastUpdate;
                    this.dataStore.trackId = trackEvent.uniqueTranId;
                    //let titleName = this._titleService.getTitle();
                    this._titleService.setTitle("Complete Loading Passangers");
                    this.saveSessionStore(this.dataStore);
                    this._uiStateStore.endBackendAction('done', false);
                }

            }, error => {
                this._uiStateStore.endBackendAction(error.toString, true);
            }
            );
    }

    getCurrentCache(): currentContextCache {
        return <currentContextCache>this._localSession.retrieve(this.cachName);
    }

    saveSessionStore(dataStore: currentContextCache): void {
        this._localSession.store(this.cachName, dataStore);
        this.dataStore = dataStore;
        this.publish();
    }

    saveCurrentState(order: string): void {
        debugger;
        trackEvent.orderId = order;
        trackEvent.lastUpdate = new Date();
        this.dataStore.trackId = trackEvent.uniqueTranId;
        this.dataStore.lastUpdate = trackEvent.lastUpdate;
        this.dataStore.orderid = trackEvent.orderId;
        this.saveSessionStore(this.dataStore);
    }

    saveSelectedPassangers(trackid: string): void {
        trackEvent.uniqueTranId = trackid;
        this.dataStore.trackId = trackEvent.uniqueTranId;
        this.dataStore.lastUpdate = new Date();
        this.saveSessionStore(this.dataStore);
        this.publish();
    }

    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    handleErrorSignalR(error: any, message: string) {
        console.log('handleErrorSignalR Error: %s', error);
        console.log('handleErrorSignalR message: %s', message);
        this.resetCache();
    }

    resetCache() {
        debugger;
        this.dataStore = {
            passengers: [],
            flight: null,
            lastUpdate: new Date(),
            forceReload: false,
            trackId: null,
            orderid: null
        };
        this.saveSessionStore(this.dataStore);
    }

    realseOrder(oid: string, tid: string, allowAdd?: boolean, expireOrder?: Date) {
        debugger;
        if (oid == null || oid == "")
            return;
        this.dataStore.passengers.filter((p) => p.orderid != null && p.orderid != '' && p.orderid.toLowerCase() == oid.toLowerCase()).forEach((passxx) => {
            debugger;
            passxx.isHandleBy = false;
            passxx.handleById = "";
            passxx.canUpdate = true;
            passxx.isSelected = false;
            if (allowAdd != null)
                passxx.allowAdd = allowAdd;
            if (expireOrder != null)
                passxx.expireOrder = expireOrder;
        });
        this.dataStore.lastUpdate = new Date();
        this.dataStore.trackId = tid;
        this.dataStore.orderid = '';
        this.saveSessionStore(this.dataStore);

       
    }

    updatePassenger(passenger: passengerDetail) {
        this.dataStore.passengers.forEach((p, i) => {
            if (p.id === passenger.id) {
                this.dataStore.passengers[i] = passenger;
            }
        });
        this.publish();
    }

    publish(): void {
        let ob = Object.assign({}, this.dataStore);
        this._passengers.next(ob.passengers);
        this._flight.next(ob.flight);
    }

    get getExpriDateOrder(): Date {
        debugger;
        let oid=trackEvent.orderId;
        if (oid != null && oid != "") {
            let passangersOrder = this.dataStore.passengers.filter(p => p.orderid != null && p.orderid.toLowerCase() === oid.toLowerCase())[0];
            if (passangersOrder!=null)
                return passangersOrder.expireOrder;
        }
        return null;
    }

    get selectingPassangers(): userHandle {
        let user = new userHandle();
        user.uniqueTranId = Guid.newGuid();
        trackEvent.uniqueTranId = user.uniqueTranId;
        user.name = this.profileModel.model.name;
        user.userid = this.profileModel.model.id;
        user.flightid = this.dataStore.flight.id;
        user.passangers = [];
        let allselected = this.dataStore.passengers.filter(px => px.isSelecting);
        for (let selection of allselected) {
            user.passangers.push({
                isLocked: true, passangerid: selection.id, orderid: selection.orderid,
                allowAdd: selection.allowAdd, allowEdit: selection.allowEdit, expireOrder: selection.expireOrder
            });
        }
        return user;
    }

    get rollBackPassangers(): userHandle {
        let user = new userHandle();
        user.uniqueTranId = Guid.newGuid();
        trackEvent.uniqueTranId = user.uniqueTranId;
        user.name = this.profileModel.model.name;
        user.userid = this.profileModel.model.id;
        user.flightid = this.dataStore.flight.id;
        user.passangers = [];
        let allselected = this.dataStore.passengers.filter(px => px.isTrashing);
        for (let selection of allselected) {
            user.passangers.push({
                isLocked: false, passangerid: selection.id, orderid: null, allowAdd: selection.allowAdd,
                allowEdit: selection.allowEdit, expireOrder: null
            });
        }
        return user;
    }

    sendNotity(request: userHandle): Observable<Result<string>> {
        return this.http.post("/api/crm/sendNotity", request)
            .map((response: Response) => <Result<string>>response.json())
            .catch(this.handleError);
    }

    ping(): void {
        this.channelService.ping();
    }
}

@Injectable()
export class BodyRootService {
    static hasLoadAlready: boolean = false;
    constructor(
        @Inject("messaging.config")
        private messagingConfig: MessagingConfig
    ) {
    }
    inactiveScreen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    inactiveScreen$ = this.inactiveScreen.asObservable();

    errorHanlderScreen: BehaviorSubject<string> = new BehaviorSubject<string>(this.messagingConfig.MSG_TYPE_DEFUALT);
    errorHanlderScreen$ = this.errorHanlderScreen.asObservable();

    errorScreen: BehaviorSubject<errMessage> = new BehaviorSubject<errMessage>(
        {
            hasErr: false,
            isLogic: false,
            title: '',
            desc: '',
            msgType: ''
        });

    errorScreen$ = this.errorScreen.asObservable();

    setInactive(data: boolean) {
        this.inactiveScreen.next(data);
    }

    LoadScriptAnimation(elementRef: any): void {
        if (BodyRootService.hasLoadAlready == false) {
            var paper = document.createElement("script");
            paper.type = "text/javascript";
            paper.src = "/assets/js/paper.js";
            elementRef.nativeElement.appendChild(paper);
            BodyRootService.hasLoadAlready = true;
        }
    }
}
