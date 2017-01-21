﻿//https://coryrylan.com/blog/angular-observable-data-services
/// <reference path="./globals.d.ts" />
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable  } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer } from 'rxjs/Observer';
import { Subscription }       from 'rxjs/Subscription';
//import { Title }     from '@angular/platform-browser'
import {Rx} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publish';

import { Result } from './Result.Model';
import { ProfileDetail } from './ProfileDetail.Model';

import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';
import {ChannelService, ConnectionState, SessionStatus, passangerLocked, userHandle} from "./channel.service";

//https://github.com/jhades/angular2-rxjs-observable-data-services
//http://blog.angular-university.io/angular-2-application-architecture-building-applications-using-rxjs-and-functional-reactive-programming-vs-redux/

export class UiState {
    constructor(public actionOngoing:
        boolean, public message: string,
        public isErr: boolean, public forceLoad: boolean

    ) {
    }
}

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
        this._uiState.next({
            actionOngoing: true,
            message,
            isErr: false, forceLoad: true
        });
    }

    endBackendAction(message: string, isErr: boolean) {
        this._uiState.next({
            actionOngoing: false,
            message: message, isErr: isErr, forceLoad: isErr
        });
    }

    signalErr(message: string) {
        debugger;
        let getLast = this._uiState.getValue();
        this._uiState.next({
            actionOngoing: getLast.actionOngoing,
            message: message, isErr: getLast.isErr, forceLoad: true
        });
    }
}

export class currentContextCache {
    flight: flightDetail;
    passengers: passengerDetail[];
    lastUpdate: Date;
    forceReload: boolean;
}

export interface passengerDetail {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    ticket: string;
    pnr: string;
    handlyByName: string;
    handleById: string;
    ownerRecordid: string;//who user lock/unlock record
    isHandleBy: boolean;
    cabin: string;
    isSelected: boolean;
    isSelecting: boolean;
    isTrashing: boolean;
    flightid: string;
    orderid: string;
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
    passengers: passengerDetail[];
}

@Injectable()
export class PassengersBackendService {
    //https://angular-2-training-book.rangle.io/handout/observables/cold_vs_hotObsv_observables.html
    //hotObsv: Rx.ConnectableObservable<SessionStatus>;
    //subscription: Subscription;
    private channel = "tasks";
    connectionState$: Observable<string>;
    passengers: Observable<passengerDetail[]>;

    private _passengers: BehaviorSubject<passengerDetail[]>;
    private _flight: BehaviorSubject<flightDetail>;
    flight$: Observable<flightDetail>;
    // private baseUrl: string;
    private dataStore: currentContextCache;
    profileModel: Result<ProfileDetail>;
    private cachName: string = "currentContextCache5";
    private _isDisconnected: BehaviorSubject<boolean>;
    isDisconected$: Observable<boolean>;

    constructor(private http: Http, private _localSession: SessionStorageService,
        private channelService: ChannelService,
        private _uiStateStore: UiStateStore
    ) {
        this._isDisconnected = new BehaviorSubject<boolean>(true);
        this.isDisconected$ = this._isDisconnected.asObservable();
        this.profileModel = profileUser;

        // Let's wire up to the signalr observables
        this.connectionState$ = this.channelService.connectionState$
            .map((state: ConnectionState) => {
                debugger;
                let connectionName = ConnectionState[state];
                return connectionName;
            }).share();//share 

        this.connectionState$.subscribe((status: string) => {
            if (status == "Disconnected") {
                this._isDisconnected.next(true);
            }
            else {
                this._isDisconnected.next(false);
            }
        }, (error: any) => { });

        this.channelService.error$.subscribe(
            (error: any) => {
                debugger; console.warn(error);
                this._uiStateStore.signalErr(error);
            },
            (error: any) => {
                debugger;
                console.error("errors$ error", error);
                if (this.dataStore != null) {
                    this.dataStore.forceReload = true;
                    this.saveSessionStore(this.dataStore);
                }
                this._uiStateStore.signalErr(error);
            }
        );

        // Wire up a handler for the starting$ observable to log the
        //  success/fail result
        this.channelService.starting$.subscribe(
            () => { console.log("signalr service has been started"); },
            () => {
                console.warn("signalr service failed to start!");
                debugger;
                if (this.dataStore != null) {
                    this.dataStore.forceReload = true;
                    this.saveSessionStore(this.dataStore);
                }
            }
        );

        this.startChannel();

        //this.baseUrl = 'api/CRM/GetAllPassangers?flight=';
        this.dataStore = {
            passengers: [],
            flight: null,
            lastUpdate: new Date(),
            forceReload: false
        };

        let data = this.getCurrentCache();// <currentContextCache>this._localSession.retrieve("currentContextCache");
        if (data != null) {
            this.dataStore = data;
        }

        this._passengers = <BehaviorSubject<passengerDetail[]>>new BehaviorSubject([]);
        this.passengers = this._passengers.asObservable();
        this._flight = new BehaviorSubject({
            id: '',
            name: '',
            number: '',
            departure: '',
            destination: '',
            departureDates: '',
            arrivedDates: '',
            departureTime: '',
            arrivedTime: '',
            isSelected: false
        });
        this.flight$ = this._flight.asObservable();
    }

    startChannel(): void {
        console.log("Starting the channel service");
        this.channelService.start();
    }

    get passangersCached(): passengerDetail[] {
        return this.dataStore.passengers;
    }

    loadSessionStore(flight: string, order: string, forceNeed: boolean = true): void {
        let data = this.getCurrentCache();
        if (data != null)
            this.dataStore = data;

        if (this.dataStore == null ||
            (this.dataStore.forceReload == true && forceNeed == true) || this.dataStore.passengers == null || this.dataStore.passengers.length == 0) {
            this.forceLoad(flight, order);
        }
        else {
            this.publish();
        }
    }

    forceLoad(flight: string, order: string) {
        this._uiStateStore.startBackendAction('loading..');

        let url = 'api/CRM/GetFlightPassangers?flight=' + flight + '&user=' + this.profileModel.model.id + '&order=' + order;
        this.http.get(url)
            .map((response: Response) => <Result<contextPassangers>>response.json())
            .catch(this.handleError)
            .subscribe((data: Result<contextPassangers>) => {
                debugger;
                this.dataStore.passengers = data.model.passengers;
                this.dataStore.flight = data.model.flight;
                this.dataStore.forceReload = data.isErr;
                if (data.isErr) {
                    this._uiStateStore.endBackendAction(data.desc, true);
                } else {
                    this._uiStateStore.endBackendAction('done', false);
                    
                }
                this.saveSessionStore(this.dataStore);
            }, error => {
              
                this._uiStateStore.endBackendAction(error.toString, true);
            }
            );
    }

    getCurrentCache(): currentContextCache {
        return <currentContextCache>this._localSession.retrieve(this.cachName);
    }

    saveSelectedFlight(flightDetail: flightDetail): void {
        debugger;
        let data = this.getCurrentCache();
        if (data == null) {
            this.dataStore = {
                passengers: [],
                flight: flightDetail,
                lastUpdate: new Date,
                forceReload: true
            };
        }
        if (this.dataStore != null) {
            if (this.dataStore.flight != null) {
                if (this.dataStore.flight.id != flightDetail.id) {
                    this.dataStore.passengers = [];
                    this.dataStore.flight = flightDetail;
                    this.dataStore.forceReload = true;
                }
            }
            else {
                this.dataStore.passengers = [];
                this.dataStore.flight = flightDetail;
                this.dataStore.forceReload = true;
            }
            this.saveSessionStore(this.dataStore);
        }
    }

    saveSessionStore(dataStore: currentContextCache): void {
        dataStore.lastUpdate = new Date();
        this._localSession.store(this.cachName, dataStore);
        this.dataStore = dataStore;
        this.publish();
    }

    saveCurrentState(): void {
        this.saveSessionStore(this.dataStore);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    updatePassenger(passenger: passengerDetail) {
        this.dataStore.passengers.forEach((p, i) => {
            if (p.id === passenger.id) {
                debugger;
                this.dataStore.passengers[i] = passenger;
                this.dataStore.passengers[i].ownerRecordid = this.profileModel.model.id;
            }
        });
        this._passengers.next(Object.assign({}, this.dataStore).passengers);

    }

    publish(): void {
        //this._passengers.next(Object.assign({}, this.dataStore).passengers);
        let ob = Object.assign({}, this.dataStore);
        this._passengers.next(ob.passengers);
        this._flight.next(ob.flight);
    }

    get selectingPassangers(): userHandle {
        debugger;
        let user = new userHandle();
        user.name = this.profileModel.model.name;
        user.userid = this.profileModel.model.id;
        user.flightid = this.dataStore.flight.id;
        user.passangers = [];
        let allselected = this.dataStore.passengers.filter(px => px.isSelecting);
        for (let selection of allselected) {
            user.passangers.push({
                isLocked: true, passangerid: selection.id
            });
        }
        return user;
    }

    get rollBackPassangers(): userHandle {
        debugger;
        let user = new userHandle();
        user.name = this.profileModel.model.name;
        user.userid = this.profileModel.model.id;
        user.flightid = this.dataStore.flight.id;
        user.passangers = [];
        let allselected = this.dataStore.passengers.filter(px => px.isTrashing);
        for (let selection of allselected) {
            user.passangers.push({
                isLocked: false, passangerid: selection.id
            });
        }
        return user;
    }

    sendNotity(request: userHandle): Observable<Result<string>> {
        // debugger;
        return this.http.post("/api/crm/sendNotity", request)
            .map((response: Response) => <Result<string>>response.json())
            .catch(this.handleError);
    }

    ping(): void {
        debugger;
        this.channelService.ping();
    }
}


