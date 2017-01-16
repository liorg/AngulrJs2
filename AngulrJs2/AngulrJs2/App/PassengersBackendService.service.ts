//https://coryrylan.com/blog/angular-observable-data-services

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable  } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer } from 'rxjs/Observer';
import { Subscription }       from 'rxjs/Subscription';

import 'rxjs/add/operator/map';
/*
Returns an observable sequence that shares a single subscription to the underlying sequence.
This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
*/
import Rx from 'rxjs/Rx';

import 'rxjs/add/operator/share';

import 'rxjs/add/operator/publish';
import "rxjs/add/operator/publishLast";

import { Result } from './Result.Model';
import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';
import {ChannelService, ConnectionState, ChannelEvent} from "./channel.service";

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

@Injectable()
export class PassengersBackendService {
    //https://angular-2-training-book.rangle.io/handout/observables/cold_vs_hotObsv_observables.html
    hotObsv: Rx.ConnectableObservable<ChannelEvent>;
    observer: Observer<ChannelEvent>;
    subscription: Subscription;
    private channel = "tasks";
    connectionState$: Observable<string>;
    passengers: Observable<passengerDetail[]>;
    flightId: Observable<string>;
    private _passengers: BehaviorSubject<passengerDetail[]>;
    private baseUrl: string;
    private dataStore: currentContextCache;
    private cachName:string = "currentContextCache";
    constructor(private http: Http, private _localSession: SessionStorageService,
        private channelService: ChannelService,
        private _uiStateStore: UiStateStore
    ) {
        // Let's wire up to the signalr observables
        this.connectionState$ = this.channelService.connectionState$
            .map((state: ConnectionState) => {
                debugger;
                return ConnectionState[state];
            }).share();//share 

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
                if (this.dataStore != null) {
                    this.dataStore.forceReload = true;
                    this.saveSessionStore(this.dataStore);
                }
            }
        );

        // Start the connection up!
        console.log("Starting the channel service");

        this.channelService.start();
        debugger;
        this.observer = {
            next: function (x: ChannelEvent) {
                debugger;
                console.log(x.Data);
            },
            error: function (err) {
                debugger;
                console.log('Error: %s', err);
                this._uiStateStore.signalErr(err);

                if (this.dataStore != null) {
                    this.dataStore.forceReload = true;
                    this.saveSessionStore(this.dataStore);
                }
            },
            complete: function () {
                console.log('Completed');
            }
        };

        this.hotObsv = this.channelService.sub(this.channel).publish();
        this.hotObsv.connect();//hot

        this.baseUrl = 'api/CRM/GetAllPassangers?flight=';
        this.dataStore = { passengers: [], flight: null, lastUpdate: new Date(),forceReload:false };

        let data = <currentContextCache>this._localSession.retrieve("currentContextCache");
        if (data != null) {
            this.dataStore = data;
        }

        this._passengers = <BehaviorSubject<passengerDetail[]>>new BehaviorSubject([]);
        this.passengers = this._passengers.asObservable();
    }

    loadSessionStore(flight: string): void {
        let data = this.getCurrentCache();
        if (data != null)
            this.dataStore = data;

        if (this.dataStore == null || this.dataStore.forceReload==true || this.dataStore.passengers == null || this.dataStore.passengers.length == 0) {
            this.forceLoad(flight);
        }
        else {
            this._passengers.next(Object.assign({}, this.dataStore).passengers);
        }

    }

    forceLoad(flight: string) {
        this._uiStateStore.startBackendAction('loading..');
        debugger;
        //https://www.bennadel.com/blog/3187-partial-stream-execution-a-case-for-hotObsv-rxjs-observables-in-angular-2-1-1.htm
        if (this.subscription != null){
            debugger;
            this.subscription.unsubscribe();
        }
        this.http.get(this.baseUrl + flight)
            .map((response: Response) => <Result<passengerDetail[]>>response.json())
            .catch(this.handleError)
            .subscribe((data: Result<passengerDetail[]>) => {
                debugger;
                this.dataStore.passengers = data.model;
                if (data.isErr) {
                    this._uiStateStore.endBackendAction(data.desc, true);
                } else {
                    this._uiStateStore.endBackendAction('ok..', false);
                    debugger;
                    this.subscription = this.hotObsv.subscribe(this.observer);
                }
                this.saveSessionStore(this.dataStore);
            }, error => {
                debugger;
                //callbackErr(error)
                this._uiStateStore.endBackendAction(error.toString, true);
            }
            );
    }

    getCurrentCache(): currentContextCache {
        return <currentContextCache>this._localSession.retrieve(this.cachName);
    }

    getCurrentFlight(): flightDetail {
        let data = this.getCurrentCache();
        if (this.dataStore != null && this.dataStore.flight != null) {
            return this.dataStore.flight;
        }
        return null;
    }

    saveSelectedFlight(flightDetail: flightDetail): void {
        debugger;
        let data = this.getCurrentCache();
        if (data == null) {
            this.dataStore = { passengers: [], flight: flightDetail, lastUpdate: new Date() };
        }
        if (this.dataStore != null && this.dataStore.flight != null) {
            if (this.dataStore.flight.id != flightDetail.id) {
                this.dataStore.passengers = [];
                this.dataStore.flight = flightDetail;
            }
            this.saveSessionStore(this.dataStore);
        }

    }

    saveSessionStore(dataStore: currentContextCache): void {
        dataStore.lastUpdate = new Date();
        this._localSession.store(this.cachName, dataStore);
        this.dataStore = dataStore;
        this._passengers.next(Object.assign({}, this.dataStore).passengers);
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

    anySelectingPassangers(): boolean {
        if (this.dataStore.passengers != null && this.dataStore.passengers.length > 0) {
            let findPass = this.dataStore.passengers.filter(
                pass => pass.isSelecting === true);
            debugger;
            if (findPass != null && findPass.length > 1)
                return true;
        }
        return false;
    }

    badgeCount(): string {
        return this.passengersSelectedCount().toString();
    }

    passengersSelectedCount(): number {
        let count = this.dataStore.passengers.filter(pe => pe.isSelected == true).length;
        return count;
    }

    getPassengersSelected(): passengerDetail[] {
        return this.dataStore.passengers.filter(pe => pe.isSelected == true);
    }

    setTrashSelectingToSelected(): number {
        let trashsAsQuerable = this.dataStore.passengers.filter(pas => pas.isTrashing);
        let trashs = trashsAsQuerable.forEach(pass => {
            pass.isSelected = false;
            pass.isTrashing = false;
        });
        let count = trashsAsQuerable.length;
        this._passengers.next(Object.assign({}, this.dataStore).passengers);
        return count;
    }

    changeSelectingToSelected() {
        debugger;
        this.dataStore.passengers.forEach(pass => {
            if (pass.isSelecting) {
                pass.isSelected = pass.isHandleBy ? false : true;
                pass.isSelecting = false;
            }
        });

        this._passengers.next(Object.assign({}, this.dataStore).passengers);
    }

    cancelPassengersselected(): void {
        this.dataStore.passengers.forEach(pass => {
            pass.isSelected = false;
            pass.isTrashing = false;
        });

        this._passengers.next(Object.assign({}, this.dataStore).passengers);
    }

    updatePassenger(passenger: passengerDetail) {
        this.dataStore.passengers.forEach((p, i) => {
            if (p.id === passenger.id) {
                debugger;
                this.dataStore.passengers[i] = passenger;
            }
        });


        this._passengers.next(Object.assign({}, this.dataStore).passengers);

    }

    callPingSignalR(): void {
        this.http.get("/tasks/long")
            .map((res: Response) => { debugger; res.json() })
            .subscribe((message: string) => { debugger; console.log(message); });
    }
}
